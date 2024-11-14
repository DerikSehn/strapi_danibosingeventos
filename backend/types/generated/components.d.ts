import type { Schema, Struct } from '@strapi/strapi';

export interface ButtonCtaButton extends Struct.ComponentSchema {
  collectionName: 'components_button_cta_buttons';
  info: {
    description: '';
    displayName: 'CtaButton';
  };
  attributes: {
    href: Schema.Attribute.String;
    title: Schema.Attribute.String;
    variation: Schema.Attribute.Enumeration<
      ['primary', 'secondary', 'outlined', 'ghost', 'default']
    > &
      Schema.Attribute.DefaultTo<'primary'>;
  };
}

export interface LandingPageBackground extends Struct.ComponentSchema {
  collectionName: 'components_landing_page_backgrounds';
  info: {
    displayName: 'Background';
  };
  attributes: {
    alt: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
    title: Schema.Attribute.String;
  };
}

export interface PeopleContact extends Struct.ComponentSchema {
  collectionName: 'components_people_contacts';
  info: {
    displayName: 'Contact';
  };
  attributes: {
    address: Schema.Attribute.Text;
    email: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    name: Schema.Attribute.String;
    phone: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 11;
        minLength: 11;
      }> &
      Schema.Attribute.DefaultTo<'phoneNumber'>;
  };
}

export interface SectionFeature extends Struct.ComponentSchema {
  collectionName: 'components_section_features';
  info: {
    description: '';
    displayName: 'Feature';
    icon: '';
  };
  attributes: {
    heading: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    subHeading: Schema.Attribute.Text;
  };
}

export interface SectionFeaturesSection extends Struct.ComponentSchema {
  collectionName: 'components_section_features_sections';
  info: {
    description: '';
    displayName: 'Features Section';
  };
  attributes: {
    description: Schema.Attribute.Text;
    feature: Schema.Attribute.Component<'section.feature', true>;
    title: Schema.Attribute.String;
  };
}

export interface SectionHeroSection extends Struct.ComponentSchema {
  collectionName: 'components_section_hero_sections';
  info: {
    description: '';
    displayName: 'Hero Section';
  };
  attributes: {
    backgroundImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    button: Schema.Attribute.Component<'button.cta-button', true>;
    description: Schema.Attribute.Text;
    heroImage: Schema.Attribute.Media<'images' | 'files' | 'videos', true>;
    title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'button.cta-button': ButtonCtaButton;
      'landing-page.background': LandingPageBackground;
      'people.contact': PeopleContact;
      'section.feature': SectionFeature;
      'section.features-section': SectionFeaturesSection;
      'section.hero-section': SectionHeroSection;
    }
  }
}
