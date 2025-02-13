import Imap from 'imap';
import { simpleParser } from 'mailparser';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import sendEmail from './nodemailer.service.js';
import logger from './logger.js';

dotenv.config();

const prisma = new PrismaClient();

const imapConfig = {
    user: process.env.NODE_MAILER_USER,
    password: process.env.NODE_MAILER_PASSWORD,
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
};

export default async function checkEmailForSubject() {
    return new Promise((resolve, reject) => {
        const imap = new Imap(imapConfig);

        imap.once('ready', () => {
            imap.openBox('INBOX', false, async (err, box) => {
                if (err) {
                    reject(err);
                    return;
                }

                const searchCriteria = ['UNSEEN', ['SUBJECT', 'Recharge with 5 credits']];
                const fetchOptions = { bodies: '', markSeen: true };

                imap.search(searchCriteria, (err, results) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    if (results.length === 0) {
                        // console.log('No matching emails found');
                        imap.end();
                        resolve();
                        return;
                    }

                    const fetch = imap.fetch(results, fetchOptions);
                    fetch.on('message', (msg) => {
                        msg.on('body', async (stream) => {
                            try {
                                const parsed = await simpleParser(stream);
                                const senderEmail = parsed.from.value[0].address;
                                console.info(`Recharge request detected from: ${senderEmail}`);

                                const userCredit = await prisma.user.findUnique({
                                    where: { email: senderEmail }
                                });

                                if (userCredit && userCredit.credit < 1 && userCredit.freeTrail == false) {
                                    await prisma.user.update({
                                        where: { email: senderEmail },
                                        data: { credit: 5 , freeTrail: true},
                                    });

                                    await sendEmail(senderEmail , 'Recharge Successful' , 'Your free Recharge of 5 credits have successfully done')
                                    
                                    imap.addFlags(results, '\\Seen', (err) => {
                                        if (err) logger.error('Error marking email as read:', err);
                                    });
                                }else{
                                    await sendEmail(senderEmail , 'Out of Free Trial' , 'You already Availed our free recharge ')

                                }
                            } catch (error) {
                                logger.error("Error processing email:", error);
                                reject(error);
                            }
                        });
                    });

                    fetch.once('end', () => {
                        console.log('Done fetching emails');
                        imap.end();
                        resolve();
                    });
                });
            });
        });

        imap.once('error', (err) => reject(err));
        // imap.once('end', () => console.log('IMAP connection ended'));

        imap.connect();
    });
}
