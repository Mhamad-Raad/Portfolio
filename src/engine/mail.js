// The contact letter goes out through EmailJS (ids live with the rest of the content in src/data/about.js).
import emailjs from '@emailjs/browser';
import { EMAILJS } from '../data/about.js';

export function sendLetter({ name, email, message }) {
  return emailjs.send(EMAILJS.service, EMAILJS.template, { user_name: name, user_email: email, user_message: message }, { publicKey: EMAILJS.publicKey });
}
