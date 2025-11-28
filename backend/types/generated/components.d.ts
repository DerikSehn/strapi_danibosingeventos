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

export interface ButtonSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_button_social_links';
  info: {
    displayName: 'Social Link';
  };
  attributes: {
    icon: Schema.Attribute.String;
    text: Schema.Attribute.String;
    url: Schema.Attribute.String;
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

export interface PeopleSupplierInfo extends Struct.ComponentSchema {
  collectionName: 'components_people_supplier_infos';
  info: {
    displayName: 'Supplier Info';
  };
  attributes: {
    address: Schema.Attribute.Text;
    cnpj: Schema.Attribute.String;
    cpf: Schema.Attribute.String;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    phone: Schema.Attribute.String;
  };
}

export interface PhraseImpactPhrase extends Struct.ComponentSchema {
  collectionName: 'components_phrase_impact_phrases';
  info: {
    displayName: 'Impact Phrase';
  };
  attributes: {
    author: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    phrase: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 220;
      }>;
  };
}

export interface SectionAboutSection extends Struct.ComponentSchema {
  collectionName: 'components_section_about_sections';
  info: {
    description: '';
    displayName: 'About Section';
  };
  attributes: {
    features: Schema.Attribute.Component<'section.feature', true>;
    heading: Schema.Attribute.String;
    subHeading: Schema.Attribute.Text;
  };
}

export interface SectionContactSection extends Struct.ComponentSchema {
  collectionName: 'components_section_contact_sections';
  info: {
    description: '';
    displayName: 'Contact Section';
  };
  attributes: {
    address: Schema.Attribute.String;
    email: Schema.Attribute.Email;
    heading: Schema.Attribute.String;
    phone: Schema.Attribute.String;
    socialLinks: Schema.Attribute.Component<'button.social-link', true>;
    subHeading: Schema.Attribute.String;
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

export interface SectionGalleryItem extends Struct.ComponentSchema {
  collectionName: 'components_section_gallery_items';
  info: {
    description: 'Individual gallery item with image, title, and description';
    displayName: 'Gallery Item';
    icon: 'image';
  };
  attributes: {
    category: Schema.Attribute.String;
    description: Schema.Attribute.RichText;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionGallerySection extends Struct.ComponentSchema {
  collectionName: 'components_section_gallery_sections';
  info: {
    description: 'A section containing gallery items organized by event/category';
    displayName: 'Gallery Section';
    icon: 'grid';
  };
  attributes: {
    description: Schema.Attribute.RichText;
    items: Schema.Attribute.Component<'section.gallery-item', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'button.cta-button': ButtonCtaButton;
      'button.social-link': ButtonSocialLink;
      'landing-page.background': LandingPageBackground;
      'people.contact': PeopleContact;
      'people.supplier-info': PeopleSupplierInfo;
      'phrase.impact-phrase': PhraseImpactPhrase;
      'section.about-section': SectionAboutSection;
      'section.contact-section': SectionContactSection;
      'section.feature': SectionFeature;
      'section.features-section': SectionFeaturesSection;
      'section.gallery-item': SectionGalleryItem;
      'section.gallery-section': SectionGallerySection;
      'section.hero-section': SectionHeroSection;
    }
  }
}
