import { faker } from '@faker-js/faker';
import { AnonymizationTool } from '../store/useDataStore';

export type AnonymizationMethod = {
  name: string;
  description: string;
  apply: (value: any, tool?: AnonymizationTool) => any;
};

const applyCustomRegexp = (value: string, regexp: string): string => {
  try {
    const regex = new RegExp(regexp);
    return value.replace(regex, match => '*'.repeat(match.length));
  } catch {
    return '*'.repeat(value.length);
  }
};

export const anonymizationMethods: Record<string, AnonymizationMethod[]> = {
  fullName: [
    {
      name: 'mask',
      description: 'Replace with asterisks',
      apply: (value: string) => '*'.repeat(value.length)
    },
    {
      name: 'initials',
      description: 'Show only initials',
      apply: (value: string) => {
        return value
          .split(/\s+/)
          .map(part => `${part.charAt(0)}.`)
          .join(' ');
      }
    },
    {
      name: 'fake',
      description: 'Replace with realistic full name',
      apply: () => `${faker.person.firstName()} ${faker.person.lastName()}`
    },
    {
      name: 'lastNameOnly',
      description: 'Show only last name initial',
      apply: (value: string) => {
        const parts = value.split(/\s+/);
        if (parts.length < 2) return value;
        return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
      }
    },
    {
      name: 'firstNameOnly',
      description: 'Show only first name',
      apply: (value: string) => {
        const parts = value.split(/\s+/);
        return `${parts[0]} ${'*'.repeat(value.length - parts[0].length)}`;
      }
    }
  ],
  city: [
    {
      name: 'mask',
      description: 'Replace with asterisks',
      apply: (value: string) => '*'.repeat(value.length)
    },
    {
      name: 'fake',
      description: 'Replace with realistic city name',
      apply: () => faker.location.city()
    },
    {
      name: 'region',
      description: 'Replace with "City-" + random ID',
      apply: () => `City-${faker.string.alphanumeric(4).toUpperCase()}`
    },
    {
      name: 'similar-size',
      description: 'Replace with city of similar population size',
      apply: () => faker.location.city() // In a real app, we'd match city sizes
    }
  ],
  country: [
    {
      name: 'mask',
      description: 'Replace with asterisks',
      apply: (value: string) => '*'.repeat(value.length)
    },
    {
      name: 'fake',
      description: 'Replace with realistic country name',
      apply: () => faker.location.country()
    },
    {
      name: 'code',
      description: 'Replace with country code',
      apply: () => faker.location.countryCode()
    },
    {
      name: 'region',
      description: 'Replace with region name',
      apply: () => faker.location.county()
    }
  ],
  company: [
    {
      name: 'mask',
      description: 'Replace with asterisks',
      apply: (value: string) => '*'.repeat(value.length)
    },
    {
      name: 'fake',
      description: 'Replace with realistic company name',
      apply: () => faker.company.name()
    },
    {
      name: 'prefix',
      description: 'Replace with "Company-" + random ID',
      apply: () => `Company-${faker.string.alphanumeric(6).toUpperCase()}`
    },
    {
      name: 'industry',
      description: 'Replace with generic industry name',
      apply: () => `${faker.company.buzzNoun()} ${faker.company.buzzAdjective()} Corp`
    }
  ],
  ssn: [
    {
      name: 'mask-full',
      description: 'Replace entire SSN with asterisks',
      apply: (value: string) => '*'.repeat(value.length)
    },
    {
      name: 'mask-partial',
      description: 'Show only last 4 digits',
      apply: (value: string) => {
        const digits = value.replace(/\D/g, '');
        return `***-**-${digits.slice(-4)}`;
      }
    },
    {
      name: 'fake',
      description: 'Replace with realistic SSN',
      apply: () => {
        const area = Math.floor(Math.random() * 900) + 100;
        const group = Math.floor(Math.random() * 90) + 10;
        const serial = Math.floor(Math.random() * 9000) + 1000;
        return `${area}-${group}-${serial}`;
      }
    },
    {
      name: 'preserve-format',
      description: 'Keep format, replace digits with X',
      apply: (value: string) => value.replace(/\d/g, 'X')
    }
  ],
  text: [
    {
      name: 'mask',
      description: 'Replace with asterisks',
      apply: (value: string) => '*'.repeat(value.length)
    },
    {
      name: 'fake',
      description: 'Replace with fake text',
      apply: () => faker.lorem.word()
    }
  ],
  email: [
    {
      name: 'mask',
      description: 'Replace with asterisks except domain',
      apply: (value: string) => {
        const [local, domain] = value.split('@');
        return `${'*'.repeat(local.length)}@${domain}`;
      }
    },
    {
      name: 'fake',
      description: 'Replace with realistic fake email',
      apply: () => faker.internet.email()
    }
  ],
  firstName: [
    {
      name: 'mask',
      description: 'Replace with asterisks',
      apply: (value: string) => '*'.repeat(value.length)
    },
    {
      name: 'fake',
      description: 'Replace with realistic first name',
      apply: () => faker.person.firstName()
    },
    {
      name: 'initial',
      description: 'Show only first initial',
      apply: (value: string) => `${value.charAt(0)}.`
    }
  ],
  lastName: [
    {
      name: 'mask',
      description: 'Replace with asterisks',
      apply: (value: string) => '*'.repeat(value.length)
    },
    {
      name: 'fake',
      description: 'Replace with realistic last name',
      apply: () => faker.person.lastName()
    },
    {
      name: 'initial',
      description: 'Show only first initial',
      apply: (value: string) => `${value.charAt(0)}.`
    },
    {
      name: 'origin-preserve',
      description: 'Replace with name of similar origin',
      apply: (value: string) => {
        const suffix = value.toLowerCase();
        if (suffix.endsWith('ez')) return faker.person.lastName() + 'ez';
        if (suffix.endsWith('son')) return faker.person.lastName() + 'son';
        if (suffix.endsWith('ski')) return faker.person.lastName() + 'ski';
        if (suffix.endsWith('ian')) return faker.person.lastName() + 'ian';
        return faker.person.lastName();
      }
    }
  ],
  phone: [
    {
      name: 'mask',
      description: 'Show only last 4 digits',
      apply: (value: string) => {
        const digits = value.replace(/\D/g, '');
        return `****-****-${digits.slice(-4)}`;
      }
    },
    {
      name: 'fake',
      description: 'Replace with fake phone number',
      apply: () => faker.phone.number()
    }
  ],
  date: [
    {
      name: 'mask',
      description: 'Show only year',
      apply: (value: string) => new Date(value).getFullYear().toString()
    },
    {
      name: 'offset',
      description: 'Offset by random days',
      apply: (value: string) => {
        const date = new Date(value);
        const offset = Math.floor(Math.random() * 60) - 30;
        date.setDate(date.getDate() + offset);
        return date.toISOString().split('T')[0];
      }
    }
  ],
  number: [
    {
      name: 'mask',
      description: 'Replace with zeros',
      apply: (value: number) => '0'.repeat(value.toString().length)
    },
    {
      name: 'range',
      description: 'Replace with random number in range',
      apply: (value: number) => {
        const magnitude = Math.pow(10, value.toString().length - 1);
        return Math.floor(Math.random() * magnitude * 9 + magnitude).toString();
      }
    }
  ],
  website: [
    {
      name: 'mask',
      description: 'Replace with asterisks except TLD',
      apply: (value: string) => {
        try {
          const url = new URL(value);
          const domain = url.hostname.split('.');
          const tld = domain.slice(-2).join('.');
          return `${'*'.repeat(url.hostname.length - tld.length)}${tld}`;
        } catch {
          return '*'.repeat(value.length);
        }
      }
    },
    {
      name: 'fake',
      description: 'Replace with realistic website URL',
      apply: () => `https://${faker.internet.domainName()}`
    }
  ],
  zipcode: [
    {
      name: 'mask',
      description: 'Replace with asterisks',
      apply: (value: string) => '*'.repeat(value.length)
    },
    {
      name: 'partial',
      description: 'Show only first digits',
      apply: (value: string) => {
        const digits = value.replace(/[^0-9]/g, '');
        if (digits.length <= 2) return value;
        return digits.slice(0, 2) + '*'.repeat(digits.length - 2);
      }
    },
    {
      name: 'fake',
      description: 'Replace with realistic zip code',
      apply: () => faker.location.zipCode()
    },
    {
      name: 'area',
      description: 'Preserve area code only',
      apply: (value: string) => {
        const clean = value.replace(/[^0-9A-Z]/gi, '');
        if (clean.length <= 1) return value;
        // For postal codes starting with letters (UK, NL, etc.)
        if (/^[A-Z]/i.test(clean)) {
          return clean.charAt(0) + '*'.repeat(clean.length - 1);
        }
        // For numeric postal codes
        return clean.charAt(0) + '*'.repeat(clean.length - 1);
      }
    }
  ]
};
