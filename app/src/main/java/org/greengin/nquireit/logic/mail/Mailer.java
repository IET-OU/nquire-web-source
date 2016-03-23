package org.greengin.nquireit.logic.mail;

import org.greengin.nquireit.entities.users.UserProfile;
import org.springframework.beans.factory.annotation.Value;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Vector;

import java.io.UnsupportedEncodingException;
import java.util.Properties;
import javax.mail.*;
import javax.mail.internet.*;

/**
 * Send a message to multiple recipients.
 */
public class Mailer {
    // Ideally, we should set this property using DI, but I can't get it to work so it is hard-coded :-(
    @Value("${server.smtpHost}")
    private String smtpHost = "smtpmail.open.ac.uk";

    private String fromEmail = "no-reply@nquire-it.org";

    public boolean sendMail(String subject, String message, List<UserProfile> recipients, boolean useBcc) {
        if (recipients.isEmpty()) {
            System.out.println("Sending message '" + subject + "' - but no recipients!");
            return true;
        }

        try {
            System.out.println("Sending mail via SMTP host " + smtpHost);
            Properties properties = new Properties();
            properties.put("mail.smtp.host", this.smtpHost);
            Session session = Session.getInstance(properties, null);
            session.setDebug(true);
            MimeMessage msg = new MimeMessage(session);
            msg.setFrom(new InternetAddress(this.fromEmail, "nQuire-it"));
            msg.setSubject("[nQuire-it] " + subject);
            msg.setText(message);

            for(UserProfile recipient: recipients) {
                if (recipient.getEmail().isEmpty()) {
                  System.out.println("User " + recipient.getUsername() + " does not have an email address");
                } else if (useBcc) {
                  System.out.println("BCC: " + recipient.getEmail());
                    msg.addRecipient(MimeMessage.RecipientType.BCC, new InternetAddress(recipient.getEmail(),recipient.getUsername()));
                } else {
                  System.out.println("To: " + recipient.getEmail());
                    msg.addRecipient(MimeMessage.RecipientType.TO, new InternetAddress(recipient.getEmail(),recipient.getUsername()));
                }
            }

            System.out.println("Sent message: " + subject);
            Transport.send(msg);
            return true;
        } catch (UnsupportedEncodingException ex) {
            ex.printStackTrace();
            return false;
        } catch (MessagingException ex) {
            ex.printStackTrace();
            return false;
        }
    }
}
