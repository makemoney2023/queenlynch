export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  publishedDate: string;
  featuredImage?: string;
  content: string;
  status: 'published' | 'gone';
}

export interface NAP {
  name: string;
  address: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    full: string;
  };
  phone: {
    primary: string;
    secondary?: string;
  };
  email: string;
  hours: {
    weekday: string;
    saturday: string;
    sunday: string;
    display: string;
  };
  owner: string;
}

export interface MinorAilment {
  name: string;
  description?: string;
}

export interface Service {
  title: string;
  description: string;
  icon?: string;
}
