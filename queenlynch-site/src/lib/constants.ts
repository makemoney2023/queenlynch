import { NAP, MinorAilment, Service } from './types';

export const NAP_DATA: NAP = {
  name: 'Queen Lynch Pharmacy',
  address: {
    street: '157 Queen St E',
    city: 'Brampton',
    province: 'ON',
    postalCode: 'L6W 3X4',
    full: '157 Queen St E, Brampton, ON L6W 3X4',
  },
  phone: {
    primary: '(905) 450-3500',
    secondary: '(905) 494-5888',
  },
  email: 'queenlynchpharmacy@gmail.com',
  hours: {
    weekday: '9am-6pm',
    saturday: '9am-12pm',
    sunday: 'Closed',
    display: 'Mon-Fri: 9am-6pm | Sat: 9am-12pm',
  },
  owner: 'Carolyn Khan',
};

export const SITE_URL = 'https://www.queenlynch.com';
export const SITE_DESCRIPTION = 'Queen Lynch is your local pharmacy in Brampton. Owned and operated by Carolyn Khan, Queen Lynch provides a multitude of services including prescription fulfillment, patient counselling, drug tracking, MedsCheck Programs and much more.';

export const MINOR_AILMENTS: MinorAilment[] = [
  { name: 'Allergic rhinitis' },
  { name: 'Candidal stomatitis (oral thrush)' },
  { name: 'Conjunctivitis (bacterial, allergic and viral)' },
  { name: 'Dermatitis (atopic, eczema, allergic and contact)' },
  { name: 'Dysmenorrhea' },
  { name: 'Gastroesophageal reflux disease (GERD)' },
  { name: 'Hemorrhoids' },
  { name: 'Herpes labialis (cold sores)' },
  { name: 'Impetigo' },
  { name: 'Insect bites and urticaria (hives)' },
  { name: 'Tick bites, post-exposure prophylaxis to prevent Lyme disease' },
  { name: 'Musculoskeletal sprains and strains' },
  { name: 'Urinary tract infections (uncomplicated)' },
];

export const SPECIALIZED_SERVICES: Service[] = [
  {
    title: 'Palliative Medication',
    description: 'We provide specialized medication management for oncology and palliative care patients, ensuring comfort and symptom control with compassionate service tailored to individual needs.',
  },
  {
    title: 'Diabetes Education',
    description: 'Our diabetes education service offers personalized counseling on medication management, blood glucose monitoring, lifestyle modifications, and preventative care to help you effectively manage your condition.',
  },
  {
    title: 'Naturopathic Therapy',
    description: 'We offer guidance on natural health products, supplements, and alternative therapies that complement conventional treatments, helping you integrate natural approaches into your healthcare routine.',
  },
];

export const GONE_BLOG_SLUGS = [
  'mfx1yhx_6',
  'jsal-6iby0c2',
  '4iw0q6ad21w',
];
