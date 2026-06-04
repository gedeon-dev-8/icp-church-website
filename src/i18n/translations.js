// ──────────────────────────────────────────────────────────────────
// Centralized translations for English (en) and French (fr).
// Edit copy here — components call useLang().t('section.key').
// ──────────────────────────────────────────────────────────────────

// ── Icon set — used by BOTH the home Announcement section and the
// Departments page so the same concept always carries the same glyph.
// We've standardised on Font Awesome (solid). The legacy variable
// names are preserved to minimise churn in the translation entries
// below — each one now points to the closest FA solid equivalent.
import {
  faBookOpen,
  faSeedling,
  faHandshakeAngle,
  faHouse,
  faMicrophoneLines,
  faTowerBroadcast,
  faFire,
  faHandshake,
  faHandHoldingHeart,
  faWallet,
  faLanguage,
  faSpa,
} from '@fortawesome/free-solid-svg-icons';

const OPEN_BOOK_ICON = faBookOpen;
const SPROUT_ICON = faSeedling;
const HEART_HANDSHAKE_ICON = faHandshakeAngle;
const HOUSE_ICON = faHouse;
const MIC_VOCAL_ICON = faMicrophoneLines;
const RADIO_TOWER_ICON = faTowerBroadcast;
const FLAME_ICON = faFire;
const HANDSHAKE_ICON = faHandshake;
const HAND_HEART_ICON = faHandHoldingHeart;
const WALLET_ICON = faWallet;
const LANGUAGES_ICON = faLanguage;
const FLOWER_2_ICON = faSpa;

import YT_THUMB from '../assets/images/YouTube-Thumbnail.png';

// Sermon thumbnails are shared across languages.
// Each sermon points to its own YouTube video. Replace the youtubeId
// to swap a sermon — the section will render the matching link without
// any other code changes. Order matches the items array below.
const SERMON_REFS = [
  { id: 's1', youtubeId: 'c2gIPYPCljo', thumbnail: YT_THUMB }, // Papa Vianney  (Eld. Dr. Vianney Kambale)
  { id: 's2', youtubeId: 'DhoPyTMcNgQ', thumbnail: YT_THUMB }, // Pastor Jules  (Past. Jules Mupenda)
  { id: 's3', youtubeId: 'T3QJ-MT0sMw', thumbnail: YT_THUMB }, // Papa Steven   (Eld. Steven Ndaye)
];

// ── Merge helper ─────────────────────────────────
const mergeRefs = (refs, items) => refs.map((r, i) => ({ ...r, ...items[i] }));

// ── ENGLISH ──────────────────────────────────────
const en = {
  nav: {
    home: 'Home',
    about: 'About',
    services: 'Services',
    announcement: 'Schedule',
    sermons: 'Sermons',
    events: 'Events',
    departments: 'Departments',
    gallery: 'Gallery',
    visit: 'Visit',
    contact: 'Contact',
  },

  common: {
    backToTop: 'Back to top',
    learnMore: 'Learn more',
    join: 'Join',
    rsvp: 'RSVP',
    send: 'Send',
    sending: 'Sending…',
    viewAll: 'View All',
    readMore: 'Read more',
    backToHome: 'Back to home',
    en: 'English',
    fr: 'Français',
    switchToFr: 'Switch to French',
    switchToEn: 'Switch to English',
    switchToLight: 'Switch to light theme',
    switchToDark: 'Switch to dark theme',
    skipToContent: 'Skip to main content',
  },

  hero: {
    eyebrow: 'Est. Pretoria · Community of Faith',
    titleLine1: 'The International',
    titleLine2: 'Church',
    titleAccent: 'of Pretoria',
    sub: 'A family of believers from across Africa, united around one truth — the Word of God. Join us as we worship, grow, and serve together.',
    ctaPrimary: 'Join Us Sunday',
    ctaSecondary: 'Our Story',
    scroll: 'Scroll to explore',
    next: {
      kicker: 'Next Gathering',
      service: 'Sunday Service',
      time: 'Sundays · 11:00',
      separator: '·',
      live: 'Happening now',
      starting: 'Starting in moments',
      cta: 'Plan your visit',
      day: 'd',
      hour: 'h',
      minute: 'm',
    },
  },

  ticker: [
    'Sunday Service', 'Sunday School', 'Wednesday Service', 'Intercession',
    'Cell Groups', 'Youth Ministry', 'Mothers Ministry', 'Couples Ministry',
    'Community Outreach', 'Evangelism',
  ],

  about: {
    eyebrow: 'Who We Are',
    titleLine1: 'A Church',
    titleAccent: 'Willed by God',
    body: [
      '**Founded 21 November 1993** by Reverend Pastor Emmanuel Tshilenga Kabala.',
      'A welcoming spiritual home for Christians from every corner of Pretoria — and every corner of Africa.',
      'We work hand-in-hand with every church that names Jesus as Lord, building **one body across many traditions**.',
      'Come as you are. Stay as family.',
    ],
    pullQuote: '“A welcoming spiritual home for all who call on the name of Jesus.”',
    values: [
      { title: 'Faith', desc: 'Grounded in the Gospel of Jesus Christ, we live by His Word and confess Him as Lord and Savior of all.' },
      { title: 'Unity', desc: 'We embrace believers from all nations, building one spiritual family under Christ in love and harmony.' },
      { title: 'Transformation', desc: 'Committed to spiritual growth and renewal through worship, teaching, and the power of the Holy Spirit.' },
    ],
    cta: 'Get In Touch',
    badgeNum: '33+',
    badgeLabel: 'Years of Grace',
  },

  // ── Stats band (Home page) ─────────────────────────────────────
  // Numbers are derived from real data at runtime; only the labels
  // come from translations.
  stats: {
    labels: {
      years: 'Years of grace',
      departments: 'Departments',
      sermons: 'Sermons online',
      photos: 'Photos archived',
      streamingSince: 'years streaming online',
    },
  },

  // ── Next-service slide-in banner ───────────────────────────────
  nextService: {
    title: 'See you Sunday',
    cta: 'Plan your visit',
    dismiss: 'Dismiss',
    aria: 'Next Sunday service reminder',
    live: 'Live now',
    starting: 'Starting soon',
    todayIn: 'Today, in',
    tomorrow: 'Tomorrow · 09:00',
    inDays: 'In {n} days',
  },

  // ── Church Announcement (replaces the old Services section) ────
  // Edit this block to update the public schedule.
  announcement: {
    eyebrow: 'Church Announcement',
    titleLine1: 'Our',
    titleAccent: 'Weekly Rhythm',
    sub: 'When we gather, where we meet, and how to find us. Drop in any time — there is a place at the table for you.',
    locationsLabel: 'Locations',
    groups: [
      {
        id: 'weekly',
        title: 'Weekly Gatherings',
        items: [
          {
            id: 'sunday',
            icon: OPEN_BOOK_ICON,
            name: 'Sunday Service & Sunday School',
            when: 'Sunday · 11:00 – 13:00',
          },
          {
            id: 'wednesday',
            icon: SPROUT_ICON,
            name: 'Wednesday Service',
            when: '1st Wednesday of the Month',
          },
          {
            id: 'intercession',
            icon: HAND_HEART_ICON,
            name: 'Intercession',
            when: 'Saturday · 15:30 – 17:00',
          },
          {
            id: 'choir',
            icon: MIC_VOCAL_ICON,
            name: 'Choir',
            when: 'Saturday · 15:00 – 18:00',
            extra: 'Wednesday · 17:00 – 19:30 (except 1st Wednesday)',
          },
        ],
      },
      {
        id: 'cells',
        title: 'Cell Groups',
        items: [
          {
            id: 'cells',
            icon: HOUSE_ICON,
            name: 'Cell Groups',
            when: 'Weekly meetings',
            // locations: ['PTA CBD', 'PTA Gardens', 'Sunnyside', 'Centurion'],
            locations: [
              {
                name: 'CENTURION',
                day: 'Tuesday',
                time: '18:00',
              },
              {
                name: 'SUNNYSIDE',
                day: 'Thursday',
                time: '18:00',
              },
              {
                name: 'PTA CBD',
                day: 'Friday',
                time: '18:30',
              },
              {
                name: 'PTA GARDENS',
                day: 'Friday',
                time: '18:30',
              },
            ],
          },
        ],
      },
      {
        id: 'ministries',
        title: 'Ministries',
        groupNote: 'Monthly & Workshop Focus',
        items: [
          {
            id: 'youth',
            icon: FLAME_ICON,
            name: 'Youth Ministry',
            when: 'Monthly Gathering',
            extra: 'Additional activities as scheduled',
          },
          {
            id: 'mothers',
            icon: FLOWER_2_ICON,
            name: 'Mothers’ Ministry',
            when: 'Monthly Gathering',
          },
          {
            id: 'couples',
            icon: HEART_HANDSHAKE_ICON,
            name: 'Couples’ Ministry',
            when: 'Monthly Session',
            extra: 'Quarterly Workshops / Retreats',
          },
        ],
      },
    ],
  },

  sermons: {
    eyebrow: 'Listen & Grow',
    titleLine1: 'Latest',
    titleAccent: 'Sermons',
    sub: 'Catch up on recent messages — be encouraged, equipped, and drawn deeper into the Word wherever you are.',
    cta: 'View All Sermons',
    watchAria: 'Watch on YouTube',
    items: mergeRefs(SERMON_REFS, [
      { title: 'A CALL TO BE DIFFERENT | MATTHEW 5:13–16', speaker: 'ELD. DR. VIANNEY KAMBALE', date: 'April 26, 2026', duration: '2:05:46' },
      { title: 'GOD’S PRESENCE DWELLS IN OBEDIENCE AND SUBMISSION | 2 CORINTHIANS 6:16', speaker: 'PAST. JULES MUPENDA', date: 'May 03, 2026', duration: '1:53:36' },
      { title: 'LOCATED BY GRACE | Deuteronomy 33:14-16; Exodus 1:22; 2:1-10', speaker: 'ELD. STEVEN NDAYE', date: 'May 10, 2026', duration: '2:08:40' },
    ]),
  },

  events: {
    eyebrow: 'Always On Our Calendar',
    titleLine1: 'Annual',
    titleAccent: 'Events',
    sub: 'Three gatherings we mark every single year — the rhythms that have shaped ICP for as long as we have been a church family.',
    items: [
      {
        id: 'e1',
        eventKey: 'womens',
        time: '11:00 – 13:00',
        location: '294 Flowers St. Capital Park',
        badge: 'Annual',
        title: 'Women’s Service',
        desc: 'A Sunday set apart for the women of our church family — honoured, prayed for, and celebrated. Always held on the Sunday of Women’s Day week.',
      },
      {
        id: 'e2',
        eventKey: 'christmas',
        time: '11:00 – 13:00',
        location: '294 Flowers St. Capital Park',
        badge: 'Annual',
        title: 'Christmas Service',
        desc: 'Celebrating the birth of Christ together as a family. The same flow and length as a Sunday service, every 25 December.',
      },
      {
        id: 'e3',
        eventKey: 'newYearsEve',
        time: '20:00 – 00:00',
        location: '294 Flowers St. Capital Park',
        badge: 'Annual',
        title: 'Overnight Prayer',
        desc: 'We cross from one year into the next on our knees — gathering on the night of 31 December and praying through into 1 January.',
      },
    ],
  },

  galleryHome: {
    eyebrow: 'Our Community',
    titleLine1: 'Life at',
    titleAccent: 'ICP',
    sub: 'A glimpse into our gatherings — every photo a small window into the family.',
    cta: 'View All Photos',
    // Curated captions cycled through the bento + marquee tiles in order.
    captions: [
      'Sunday Worship', 'Praise & Song', 'Fellowship', 'Community',
      'Together', 'Celebration', 'Our Sanctuary', 'Voices Lifted',
      'Hands & Hearts', 'Serving Together', 'A Joyful Noise',
      'Generations', 'Belonging', 'In His Presence', 'Family',
      'Witness', 'The Gathering',
    ],
    videoCaption: 'A moment in worship',
    statNumber: '33+',
    statLabel: 'Years of Memories',
    statCta: 'Explore the gallery',
    marqueeAria: 'More photos from ICP',
    lightboxClose: 'Close lightbox',
    lightboxPrev: 'Previous photo',
    lightboxNext: 'Next photo',

    // Editorial collection-strip between the bento and the marquee.
    // (The `years*` keys below are retained for backwards-compat; the
    // strip now reads `collectionsHeading` first.)
    collectionsHeading: 'Explore the collections',
    yearsHeading: 'Through the years',
    years: [
      { key: '2021', label: '2021', tagline: 'Coming together again' },
      { key: '2022', label: '2022', tagline: 'A year of celebration' },
      { key: '2023', label: '2023', tagline: 'Sent out & built up' },
      { key: '2024', label: '2024', tagline: 'Faithful through it all' },
    ],
  },

  // testimonials: {
  //   eyebrow: 'Voices From The Family',
  //   titleLine1: 'Why we call',
  //   titleAccent: 'this home',
  //   sub: 'Stories from real members about what ICP means to them. We hope you’ll be writing one of these someday.',
  //   items: [
  //     {
  //       id: 't1',
  //       quote: 'I walked into ICP a stranger, and within three Sundays the people knew my name and my mother’s name. That’s when I knew I was home.',
  //       name: 'Grace M.',
  //       role: 'Member since 2019',
  //       initial: 'G',
  //     },
  //     {
  //       id: 't2',
  //       quote: 'The Wednesday service got me through a year I didn’t think I could survive. Pastor preaches like he knows what your week looked like.',
  //       name: 'Daniel K.',
  //       role: 'Cell Group Leader',
  //       initial: 'D',
  //     },
  //     {
  //       id: 't3',
  //       quote: 'I came for the worship. I stayed for the community. Now I bring my children — and they run to the building like they’re going to see family. Because they are.',
  //       name: 'Esther T.',
  //       role: 'Mothers Ministry',
  //       initial: 'E',
  //     },
  //   ],
  // },

  scripture: {
    // Church theme of the year — displayed as a preamble above the verse
    themeLabel: 'Theme of the Year',
    themeTitle: 'In Your Presence',
    // Verse split so we can highlight TWO phrases independently:
    //   "...In Your presence is [fullness of joy]; In Your right hand
    //    there are [pleasures forevermore]."
    quotePart1: 'You will show me the path of life; In Your presence is ',
    quoteAccent1: 'fullness of joy',
    quotePart2: '; In Your right hand there are ',
    quoteAccent2: 'pleasures forevermore',
    quotePart3: '.',
    ref: 'Psalm 16:11 · Amplified Bible (AMP)',
  },

  map: {
    eyebrow: 'Find Us',
    titleLine1: 'Our',
    titleAccent: 'Location',
    sub: 'We are located in the heart of Pretoria Central. Whether you’re a first-time visitor or a long-time member, we’d love to see you in person.',
    addressLabel: 'Address',
    address: '294 Flowers Street\nCapital Park, Pretoria, 0084',
    directionsLabel: 'Get Directions',
    directionsAria: 'Open directions in Google Maps (opens in new tab)',
    parkingLabel: 'Parking',
    parking: 'Street parking available along Flowers Street on Sunday mornings.',
    publicLabel: 'Public Transport',
    public: 'A short walk from Capital Park station, with regular minibus taxis along Paul Kruger Street.',
    // Closing strip beneath the iframe — replaces the role of the
    // old Contact section as the site's "how to reach us" footer.
    closeEyebrow: 'Come Worship With Us',
    hoursLabel: 'Sunday Service',
    hoursValue: '11:00 – 13:00',
    emailLabel: 'Reach Us',
    emailValue: '+27 12 325 9973 | 083 524 0320',
    // Shown when the device is offline and the map embed can't load
    offlineTitle: 'You appear to be offline',
    offlineDesc: 'We can’t load the map right now, but here is where to find us in person.',
    offlineRetry: 'Try again',
  },

  // contact: {
  //   eyebrow: 'Find Us',
  //   titleLine1: 'Come',
  //   titleAccent: 'Worship With Us',
  //   items: [
  //     { icon: '📍', label: 'Location',          value: '294 Flowers Street\nCapital Park, Pretoria, 0084' },
  //     { icon: '🕐', label: 'Sunday Services',    value: 'Intercession: 07:30\nMain Service: 09:00' },
  //     { icon: '📅', label: 'Wednesday Service',  value: 'Every Wednesday Evening' },
  //     { icon: '✉️', label: 'Email',              value: 'info@icpretoria.org' },
  //   ],
  //   formEyebrow: 'Message Us',
  //   formTitleLine1: 'We’d love to',
  //   formTitleAccent: 'hear from you',
  //   fields: {
  //     firstName: 'First Name',
  //     firstNamePh: 'John',
  //     firstNameError: 'First name is required',
  //     lastName: 'Last Name',
  //     lastNamePh: 'Doe',
  //     lastNameError: 'Last name is required',
  //     email: 'Email Address',
  //     emailPh: 'john@example.com',
  //     emailErrorRequired: 'Email is required',
  //     emailErrorInvalid: 'Please enter a valid email',
  //     subject: 'Subject',
  //     subjectPh: 'How can we help?',
  //     subjectError: 'Please add a subject',
  //     message: 'Message',
  //     messagePh: 'Enter your message…',
  //     messageError: 'Please write your message',
  //   },
  //   submit: 'Send Message',
  //   successMsg: 'Thank you! Your message has been sent. We’ll be in touch soon.',
  //   errorMsg: 'Please correct the highlighted fields and try again.',
  //   notePrefix: 'Prefer email? Write to ',
  //   noteEmail: 'info@icpretoria.org',
  //   notePostfix: '.',
  // },

  footer: {
    brandName: 'ICP',
    brandSub: 'International Church of Pretoria',
    brandText: 'A church of Christ with a wonderful family of believers who come from different corners of Africa to worship the Lord.',
    estLabel: 'Est.',
    yearsLabel: 'years of grace',
    cols: [
      {
        title: 'Other Pages',
        links: [
          { label: 'Departments', href: '/departments', type: 'route' },
          { label: 'Gallery', href: '/gallery', type: 'route' },
          { label: 'Sermons', href: '/#sermons', type: 'hash' },
          { label: 'Events', href: '/#events', type: 'hash' },
        ],
      },
      {
        title: 'Church Services',
        links: [
          { label: 'Sunday Service', href: '/#announcement', type: 'hash' },
          { label: 'Wednesday Service', href: '/#announcement', type: 'hash' },
          { label: 'Intercession', href: '/#announcement', type: 'hash' },
          { label: 'Cell Groups', href: '/#announcement', type: 'hash' },
        ],
      },
    ],
    languageHead: 'Language',
    followHead: 'Follow Us',
    copy: '© {year} The International Church of Pretoria. All rights reserved.',
  },

  // ── Departments page ─────────────────────────
  departmentsPage: {
    metaTitle: 'Departments',
    eyebrow: 'Serve · Belong · Grow',
    titleLine1: 'Our Church',
    titleAccent: 'Departments',
    sub: 'Eleven teams — one calling. Whatever your gift or season of life, there is a place for you.',
    scheduleLabel: 'When',
    finalEyebrow: 'Take the next step',
    finalTitle: 'Find your place',
    finalSub: 'Visit us on a Sunday, drop us an email, or speak to leaders after service. We’ll walk with you from there.',
    finalCtaPrimary: 'Visit Us Sunday',
    finalCtaSecondary: 'Send a Message',
    items: [
      {
        id: 'choir',
        icon: MIC_VOCAL_ICON,
        title: 'Choir',
        description: 'The voices and instruments that lead worship every Sunday and Wednesday. Bring your voice or your instrument — both are welcome.',
        schedule: 'Saturdays · 15:00 – 18:00\nWednesdays · 17:00 – 19:30 (except 1st Wednesday of the month)',
      },
      {
        id: 'soundMedia',
        icon: RADIO_TOWER_ICON,
        title: 'Sound & Media',
        description: 'The team behind every service — sound, projection, livestream, photography, and social media.',
      },
      {
        id: 'sundaySchool',
        icon: OPEN_BOOK_ICON,
        title: 'Sunday School',
        description: 'Age-appropriate Bible teaching for our youngest members while the main service unfolds.',
        schedule: 'Sundays · around 12:00, as the message begins',
      },
      {
        id: 'youth',
        icon: FLAME_ICON,
        title: 'Youth',
        description: 'A space for teens and young adults to grow in faith, build friendships, and discover their calling.',
        schedule: 'Monthly gatherings · workshops · prayer sessions',
      },
      {
        id: 'couples',
        icon: HEART_HANDSHAKE_ICON,
        title: 'Couples',
        description: 'Strengthening marriages through scripture, mentorship, and honest conversation.',
        schedule: 'Monthly session · quarterly workshops',
      },
      {
        id: 'ushering',
        icon: HANDSHAKE_ICON,
        title: 'Ushering',
        description: 'The welcoming face of ICP — greeting, guiding, and caring for every person who walks through the doors.',
      },
      {
        id: 'intercession',
        icon: HAND_HEART_ICON,
        title: 'Intercession',
        description: 'A team of intercessors who carry the church, its members, and the families of our community in prayer.',
        schedule: 'Saturdays · 15:30 – 17:00',
      },
      {
        id: 'finance',
        icon: WALLET_ICON,
        title: 'Finance',
        description: 'Manages tithes, offerings, and the church’s day-to-day finances with care and transparency.',
      },
      {
        id: 'cellGroups',
        icon: HOUSE_ICON,
        title: 'Cell Groups',
        description: 'Small home-based gatherings spread across Pretoria — fellowship, Bible discussion, and prayer in real living rooms.',
        schedule: 'Weekly · PTA CBD · PTA Gardens · Sunnyside · Centurion',
      },
      {
        id: 'interpretation',
        icon: LANGUAGES_ICON,
        title: 'Interpretation',
        description: 'Live translation across languages so every visitor follows along, no matter where they’re from.',
      },
      {
        id: 'mothers',
        icon: FLOWER_2_ICON,
        title: 'Mothers',
        description: 'A monthly fellowship of women — encouragement, prayer, and shared life.',
        schedule: 'Monthly gatherings',
      },
    ],
  },

  // ── Gallery page: opening "memory lane" ──
  memoryLane: {
    eyebrow: 'Memory Lane',
    titleLine1: 'Where it all',
    titleAccent: 'began',
    body: 'Before the livestreams. Before this website. Before today’s faces. These are the days that built ICP — chapters of grace, kept in faded light.',
    scrollHint: 'Walk into today',
    prevAria: 'Previous memory',
    nextAria: 'Next memory',
    slideAria: 'Show memory',
    pause: 'Pause slideshow',
    play: 'Resume slideshow',
  },

  // ── Gallery page (chronological) ─────────────
  galleryPage: {
    metaTitle: 'Gallery',
    eyebrow: 'A Visual Journey',
    titleLine1: 'Our Story In',
    titleAccent: 'Pictures',
    sub: 'Worship, fellowship, outreach, and grace — captured in moments. Scroll through the collections that make up the life of ICP.',
    intro: 'These photographs are not just snapshots; they are mile-markers of a family being built. The faces, the smiles, the lifted hands, the shared meals — every frame is a thank-you to the God who has walked with us.',
    statPhotos: 'Photos',
    statCollections: 'Collections',
    statMemories: 'Memories',
    photosLabel: 'photos',
    navLabel: 'Jump to a collection',
    categories: {
      'ICP-Youth-Ministry': {
        title: 'Youth Ministry',
        eyebrow: 'Collection 01',
        shortLabel: 'Youth',
        caption: 'The next generation, rising up in faith. Worship nights, study sessions, retreats — the heartbeat of tomorrow at ICP.',
      },
      'ICP-Sports-Day': {
        title: 'Sports Day',
        eyebrow: 'Collection 02',
        shortLabel: 'On the field',
        caption: 'Friendly competition, lots of laughter, and a reminder that joy belongs at church too.',
      },
      'ICP-Teenage-Youths': {
        title: 'Teenage Youths',
        eyebrow: 'Collection 03',
        shortLabel: 'Teens',
        caption: 'Belonging at every age. The teen crew finding their voice, their friends, and their faith.',
      },
      'ICP-Choir-Outing': {
        title: 'Choir Outing',
        eyebrow: 'Collection 04',
        shortLabel: 'In harmony',
        caption: 'Voices that lead our Sunday worship, off-duty and out together — fellowship beyond the choir stand.',
      },
    },
    closingTitle: 'And the story continues.',
    closingBody: 'The next chapter is being written every Sunday morning at 09:00. We’d love it if you were in the picture.',
    closingCta: 'Come Worship With Us',
    emptyTitle: 'No photos in the archive yet',
    emptyDesc: 'We’re still curating this space. Come back soon — there are stories on the way.',
  },

  notFound: {
    metaTitle: 'Page Not Found',
    eyebrow: '404 · Page not found',
    titleLine1: 'This verse',
    titleAccent: 'isn’t in our book.',
    sub: 'The page you were looking for has wandered off. Let’s get you back on the path.',
    cardTitle: 'Where would you like to go?',
    cardDesc: 'Start from the beginning, or come find us in person this Sunday.',
    ctaHome: 'Back to Home',
    ctaVisit: 'Plan a visit',
  },
};

// * ── FRENCH ──────────────────────────────────────
const fr = {
  nav: {
    home: 'Accueil',
    about: 'À Propos',
    services: 'Services',
    announcement: 'Horaires',
    sermons: 'Prédications',
    events: 'Événements',
    departments: 'Départements',
    gallery: 'Galerie',
    visit: 'Visiter',
    contact: 'Contact',
  },

  common: {
    backToTop: 'Retour en haut',
    learnMore: 'En savoir plus',
    join: 'Rejoindre',
    rsvp: 'S’inscrire',
    send: 'Envoyer',
    sending: 'Envoi…',
    viewAll: 'Voir tout',
    readMore: 'Lire plus',
    backToHome: 'Retour à l’accueil',
    en: 'English',
    fr: 'Français',
    switchToFr: 'Passer au français',
    switchToEn: 'Passer à l’anglais',
    switchToLight: 'Passer au thème clair',
    switchToDark: 'Passer au thème sombre',
    skipToContent: 'Aller au contenu principal',
  },

  hero: {
    eyebrow: 'Établi à Pretoria · Communauté de Foi',
    titleLine1: 'L’Église',
    titleLine2: 'Internationale',
    titleAccent: 'de Pretoria',
    sub: 'Une famille de croyants venus de toute l’Afrique, unie autour d’une seule vérité — la Parole de Dieu. Rejoignez-nous pour adorer, grandir et servir ensemble.',
    ctaPrimary: 'Rejoignez-nous Dimanche',
    ctaSecondary: 'Notre Histoire',
    scroll: 'Faites défiler pour explorer',
    next: {
      kicker: 'Prochain Rassemblement',
      service: 'Service du Dimanche',
      time: 'Dimanches · 09:00',
      separator: '·',
      live: 'En direct',
      starting: 'Commence sous peu',
      cta: 'Planifiez votre visite',
      day: 'j',
      hour: 'h',
      minute: 'm',
    },
  },

  ticker: [
    'Service du Dimanche', 'École du Dimanche', 'Service du Mercredi', 'Intercession',
    'Groupes de Cellule', 'Ministère Jeunesse', 'Ministère des Femmes', 'Ministère des Couples',
    'Action Communautaire', 'Évangélisation',
  ],

  about: {
    eyebrow: 'Qui Sommes-Nous',
    titleLine1: 'Une Église',
    titleAccent: 'Voulue par Dieu',
    body: [
      '**Fondée le 21 novembre 1993** par le Révérend Pasteur Emmanuel Tshilenga Kabala.',
      'Un foyer spirituel accueillant pour les chrétiens de Pretoria — et de toute l’Afrique.',
      'Nous marchons main dans la main avec chaque église qui nomme Jésus comme Seigneur, bâtissant **un seul corps à travers de nombreuses traditions**.',
      'Venez comme vous êtes. Restez en famille.',
    ],
    pullQuote: '« Un foyer spirituel accueillant pour tous ceux qui invoquent le nom de Jésus. »',
    values: [
      { title: 'Foi', desc: 'Enracinés dans l’Évangile de Jésus-Christ, nous vivons selon Sa Parole et Le confessons comme Seigneur et Sauveur de tous.' },
      { title: 'Unité', desc: 'Nous accueillons les croyants de toutes les nations, bâtissant une seule famille spirituelle sous Christ dans l’amour et l’harmonie.' },
      { title: 'Transformation', desc: 'Engagés dans la croissance spirituelle et le renouveau par l’adoration, l’enseignement et la puissance du Saint-Esprit.' },
    ],
    cta: 'Nous Contacter',
    badgeNum: '33+',
    badgeLabel: 'Années de Grâce',
  },

  stats: {
    labels: {
      years: 'Années de grâce',
      departments: 'Départements',
      sermons: 'Prédications en ligne',
      photos: 'Photos archivées',
      streamingSince: 'ans de diffusion en ligne',
    },
  },

  nextService: {
    title: 'À dimanche',
    cta: 'Planifier ma visite',
    dismiss: 'Fermer',
    aria: 'Rappel du prochain service du dimanche',
    live: 'En direct',
    starting: 'Commence sous peu',
    todayIn: 'Aujourd’hui, dans',
    tomorrow: 'Demain · 09:00',
    inDays: 'Dans {n} jours',
  },

  announcement: {
    eyebrow: 'Annonces de l’Église',
    titleLine1: 'Notre',
    titleAccent: 'Rythme Hebdomadaire',
    sub: 'Quand nous nous rassemblons, où nous nous retrouvons, et comment nous trouver. Passez quand vous voulez — il y a une place à la table pour vous.',
    locationsLabel: 'Lieux',
    groups: [
      {
        id: 'weekly',
        title: 'Rassemblements Hebdomadaires',
        items: [
          {
            id: 'sunday',
            icon: OPEN_BOOK_ICON,
            name: 'Service du Dimanche & École du Dimanche',
            when: 'Dimanche · 11:00 – 13:00',
          },
          {
            id: 'wednesday',
            icon: SPROUT_ICON,
            name: 'Service du Mercredi',
            when: '1ᵉʳ mercredi du mois',
          },
          {
            id: 'intercession',
            icon: HAND_HEART_ICON,
            name: 'Intercession',
            when: 'Samedi · 15:30 – 17:00',
          },
          {
            id: 'choir',
            icon: MIC_VOCAL_ICON,
            name: 'Chorale',
            when: 'Samedi · 15:00 – 18:00',
            extra: 'Mercredi · 17:00 – 19:30 (sauf 1ᵉʳ mercredi)',
          },
        ],
      },
      {
        id: 'cells',
        title: 'Groupes de Cellule',
        items: [
          {
            id: 'cells',
            icon: HOUSE_ICON,
            name: 'Groupes de Cellule',
            when: 'Réunions hebdomadaires',
            //locations: ['PTA CBD', 'PTA Gardens', 'Sunnyside', 'Centurion'],
            locations: [
              {
                name: 'CENTURION',
                day: 'Mardi',
                time: '18:00',
              },
              {
                name: 'SUNNYSIDE',
                day: 'Jeudi',
                time: '18:00',
              },
              {
                name: 'PTA CBD',
                day: 'Vendredi',
                time: '18:30',
              },
              {
                name: 'PTA GARDENS',
                day: 'Vendredi',
                time: '18:30',
              },
            ],
          },
        ],
      },
      {
        id: 'ministries',
        title: 'Ministères',
        groupNote: 'Mensuels & Ateliers',
        items: [
          {
            id: 'youth',
            icon: FLAME_ICON,
            name: 'Ministère Jeunesse',
            when: 'Rassemblement mensuel',
            extra: 'Activités supplémentaires selon le calendrier',
          },
          {
            id: 'mothers',
            icon: FLOWER_2_ICON,
            name: 'Ministère des Mères',
            when: 'Rassemblement mensuel',
          },
          {
            id: 'couples',
            icon: HEART_HANDSHAKE_ICON,
            name: 'Ministère des Couples',
            when: 'Session mensuelle',
            extra: 'Ateliers / Retraites trimestrielles',
          },
        ],
      },
    ],
  },

  sermons: {
    eyebrow: 'Écoutez & Grandissez',
    titleLine1: 'Dernières',
    titleAccent: 'Prédications',
    sub: 'Rattrapez les messages récents — soyez encouragés, équipés et plongés plus profondément dans la Parole, où que vous soyez.',
    cta: 'Voir Toutes les Prédications',
    watchAria: 'Regarder sur YouTube',
    items: mergeRefs(SERMON_REFS, [
      { title: 'UN APPEL À ÊTRE DIFFÉRENT | MATTHIEU 5:13–16', speaker: 'ELD. DR. VIANNEY KAMBALE', date: '26 avril 2026', duration: '2:05:46' },
      { title: 'LA PRÉSENCE DE DIEU HABITE DANS L’OBÉISSANCE ET LA SOUMISSION | 2 CORINTHIENS 6:16', speaker: 'PAST. JULES MUPENDA', date: '03 mai 2026', duration: '1:53:36' },
      { title: 'PLACÉS PAR LA GRÂCE | Deutéronome 33:14-16 ; Exode 1:22 ; 2:1-10', speaker: 'ELD. STEVEN NDAYE', date: '10 mai 2026', duration: '2:08:40' },
    ]),
  },

  events: {
    eyebrow: 'Toujours à Notre Calendrier',
    titleLine1: 'Événements',
    titleAccent: 'Annuels',
    sub: 'Trois rassemblements que nous célébrons chaque année — les rythmes qui façonnent la famille ICP depuis nos débuts.',
    items: [
      {
        id: 'e1',
        eventKey: 'womens',
        time: '11:00 – 13:00',
        location: 'Sanctuaire Principal ICP',
        badge: 'Annuel',
        title: 'Service des Femmes',
        desc: 'Un dimanche réservé aux femmes de notre famille d’église — honorées, portées en prière, célébrées. Toujours le dimanche de la semaine de la Journée des Femmes.',
      },
      {
        id: 'e2',
        eventKey: 'christmas',
        time: '11:00 – 13:00',
        location: 'Sanctuaire Principal ICP',
        badge: 'Annuel',
        title: 'Service de Noël',
        desc: 'Nous célébrons ensemble la naissance du Christ. Même déroulement et durée qu’un service du dimanche, chaque 25 décembre.',
      },
      {
        id: 'e3',
        eventKey: 'newYearsEve',
        time: '22:00 – 02:00',
        location: 'Sanctuaire Principal ICP',
        badge: 'Annuel',
        title: 'Veillée de Prière',
        desc: 'Nous passons d’une année à l’autre à genoux — rassemblés dans la soirée du 31 décembre, priant jusqu’au matin du 1ᵉʳ janvier.',
      },
    ],
  },

  galleryHome: {
    eyebrow: 'Notre Communauté',
    titleLine1: 'La Vie à',
    titleAccent: 'ICP',
    sub: 'Un aperçu de nos rassemblements — chaque photo, une petite fenêtre sur la famille.',
    cta: 'Voir Toutes les Photos',
    captions: [
      'Adoration', 'Louange & Chants', 'Communion', 'Communauté',
      'Ensemble', 'Célébration', 'Notre Sanctuaire', 'Voix Élevées',
      'Mains & Cœurs', 'Servir Ensemble', 'Un Cri de Joie',
      'Générations', 'Appartenance', 'En Sa Présence', 'Famille',
      'Témoignage', 'Le Rassemblement',
    ],
    videoCaption: 'Un instant d’adoration',
    statNumber: '33+',
    statLabel: 'Années de Souvenirs',
    statCta: 'Explorer la galerie',
    marqueeAria: 'Plus de photos d’ICP',
    lightboxClose: 'Fermer la visionneuse',
    lightboxPrev: 'Photo précédente',
    lightboxNext: 'Photo suivante',

    collectionsHeading: 'Explorer les collections',
    yearsHeading: 'Au fil des années',
    years: [
      { key: '2021', label: '2021', tagline: 'De nouveau réunis' },
      { key: '2022', label: '2022', tagline: 'Une année de célébration' },
      { key: '2023', label: '2023', tagline: 'Envoyés et édifiés' },
      { key: '2024', label: '2024', tagline: 'Fidèles à travers tout' },
    ],
  },

  // testimonials: {
  //   eyebrow: 'Voix de la Famille',
  //   titleLine1: 'Pourquoi nous appelons',
  //   titleAccent: 'cela un foyer',
  //   sub: 'Témoignages de vrais membres sur ce qu’ICP représente pour eux. Nous espérons qu’un jour vous en écrirez un aussi.',
  //   items: [
  //     {
  //       id: 't1',
  //       quote: 'Je suis entré à ICP en inconnu, et en trois dimanches les gens connaissaient mon prénom et celui de ma mère. C’est là que j’ai su que j’étais chez moi.',
  //       name: 'Grace M.',
  //       role: 'Membre depuis 2019',
  //       initial: 'G',
  //     },
  //     {
  //       id: 't2',
  //       quote: 'Le service du mercredi m’a porté à travers une année que je ne pensais pas survivre. Le pasteur prêche comme s’il savait à quoi ressemblait votre semaine.',
  //       name: 'Daniel K.',
  //       role: 'Responsable de Cellule',
  //       initial: 'D',
  //     },
  //     {
  //       id: 't3',
  //       quote: 'Je suis venue pour l’adoration. Je suis restée pour la communauté. Maintenant j’amène mes enfants — et ils courent vers le bâtiment comme s’ils allaient voir leur famille. Parce que c’est le cas.',
  //       name: 'Esther T.',
  //       role: 'Ministère des Mères',
  //       initial: 'E',
  //     },
  //   ],
  // },

  scripture: {
    themeLabel: 'Thème de l’Année',
    themeTitle: 'En Ta Présence',
    quotePart1: 'Tu me feras connaître le chemin de la vie ; en Ta présence est ',
    quoteAccent1: 'la plénitude de la joie',
    quotePart2: ' ; à Ta droite sont ',
    quoteAccent2: 'des délices à jamais',
    quotePart3: '.',
    ref: 'Psaume 16:11 · Amplified Bible (AMP)',
  },

  map: {
    eyebrow: 'Nous Trouver',
    titleLine1: 'Notre',
    titleAccent: 'Emplacement',
    sub: 'Nous sommes situés au cœur du centre de Pretoria. Que vous soyez de passage ou membre de longue date, nous serions ravis de vous accueillir en personne.',
    addressLabel: 'Adresse',
    address: '294 Flowers Street\nCapital Park, Pretoria, 0084',
    directionsLabel: 'Obtenir l’itinéraire',
    directionsAria: 'Ouvrir l’itinéraire dans Google Maps (nouvel onglet)',
    parkingLabel: 'Stationnement',
    parking: 'Stationnement disponible le long de Flowers Street le dimanche matin.',
    publicLabel: 'Transports en commun',
    public: 'À quelques minutes à pied de la gare de Capital Park, taxis minibus réguliers le long de Paul Kruger Street.',
    closeEyebrow: 'Venez Adorer Avec Nous',
    hoursLabel: 'Service du Dimanche',
    hoursValue: '11:00 – 13:00',
    emailLabel: 'Nous Joindre',
    emailValue: '+27 12 325 9973 | 083 524 0320',
    offlineTitle: 'Vous semblez être hors ligne',
    offlineDesc: 'Nous ne pouvons pas charger la carte pour le moment, mais voici où nous trouver en personne.',
    offlineRetry: 'Réessayer',
  },

  // contact: {
  //   eyebrow: 'Nous Trouver',
  //   titleLine1: 'Venez',
  //   titleAccent: 'Adorer Avec Nous',
  //   items: [
  //     { icon: '📍', label: 'Emplacement',         value: '294 Flowers Street\nCapital Park, Pretoria, 0084' },
  //     { icon: '🕐', label: 'Services du Dimanche', value: 'Intercession : 07:30\nService Principal : 09:00' },
  //     { icon: '📅', label: 'Service du Mercredi',  value: 'Tous les mercredis soir' },
  //     { icon: '✉️', label: 'Email',                value: 'info@icpretoria.org' },
  //   ],
  //   formEyebrow: 'Écrivez-Nous',
  //   formTitleLine1: 'Nous serions ravis',
  //   formTitleAccent: 'd’avoir de vos nouvelles',
  //   fields: {
  //     firstName: 'Prénom',
  //     firstNamePh: 'Jean',
  //     firstNameError: 'Le prénom est requis',
  //     lastName: 'Nom',
  //     lastNamePh: 'Dupont',
  //     lastNameError: 'Le nom est requis',
  //     email: 'Adresse E-mail',
  //     emailPh: 'jean@exemple.com',
  //     emailErrorRequired: 'L’email est requis',
  //     emailErrorInvalid: 'Veuillez saisir un email valide',
  //     subject: 'Sujet',
  //     subjectPh: 'Comment pouvons-nous aider ?',
  //     subjectError: 'Veuillez ajouter un sujet',
  //     message: 'Message',
  //     messagePh: 'Saisissez votre message…',
  //     messageError: 'Veuillez écrire votre message',
  //   },
  //   submit: 'Envoyer le Message',
  //   successMsg: 'Merci ! Votre message a été envoyé. Nous vous contacterons bientôt.',
  //   errorMsg: 'Veuillez corriger les champs en surbrillance et réessayer.',
  //   notePrefix: 'Préférez l’email ? Écrivez à ',
  //   noteEmail: 'info@icpretoria.org',
  //   notePostfix: '.',
  // },

  footer: {
    brandName: 'ICP',
    brandSub: 'Église Internationale de Pretoria',
    brandText: 'Une église de Christ avec une famille merveilleuse de croyants venus des quatre coins de l’Afrique pour adorer le Seigneur.',
    estLabel: 'Fondée',
    yearsLabel: 'années de grâce',
    cols: [
      {
        title: 'Autres Pages',
        links: [
          { label: 'Départements', href: '/departments', type: 'route' },
          { label: 'Galerie', href: '/gallery', type: 'route' },
          { label: 'Prédications', href: '/#sermons', type: 'hash' },
          { label: 'Événements', href: '/#events', type: 'hash' },
        ],
      },
      {
        title: 'Services de l’Église',
        links: [
          { label: 'Service du Dimanche', href: '/#announcement', type: 'hash' },
          { label: 'Service du Mercredi', href: '/#announcement', type: 'hash' },
          { label: 'Intercession', href: '/#announcement', type: 'hash' },
          { label: 'Groupes de Cellule', href: '/#announcement', type: 'hash' },
        ],
      },
    ],
    languageHead: 'Langue',
    followHead: 'Suivez-Nous',
    copy: '© {year} L’Église Internationale de Pretoria. Tous droits réservés.',
  },

  departmentsPage: {
    metaTitle: 'Départements',
    eyebrow: 'Servir · Appartenir · Grandir',
    titleLine1: 'Nos',
    titleAccent: 'Départements',
    sub: 'Onze équipes — un seul appel. Quel que soit votre don ou votre saison de vie, il y a une place pour vous.',
    scheduleLabel: 'Quand',
    finalEyebrow: 'L’étape suivante',
    finalTitle: 'Trouvez votre place',
    finalSub: 'Visitez-nous un dimanche, écrivez-nous un e-mail, ou parlez aux responsables après le service. Nous marcherons avec vous à partir de là.',
    finalCtaPrimary: 'Visitez-Nous Dimanche',
    finalCtaSecondary: 'Envoyer un Message',
    items: [
      {
        id: 'choir',
        icon: MIC_VOCAL_ICON,
        title: 'Chorale',
        description: 'Les voix et instruments qui dirigent l’adoration chaque dimanche et mercredi. Apportez votre voix ou votre instrument — les deux sont les bienvenus.',
        schedule: 'Samedis · 15:00 – 18:00\nMercredis · 17:00 – 19:30 (sauf 1ᵉʳ mercredi du mois)',
      },
      {
        id: 'soundMedia',
        icon: RADIO_TOWER_ICON,
        title: 'Son & Médias',
        description: 'L’équipe en coulisses — son, projection, diffusion en direct, photographie et réseaux sociaux.',
      },
      {
        id: 'sundaySchool',
        icon: OPEN_BOOK_ICON,
        title: 'École du Dimanche',
        description: 'Enseignement biblique adapté à l’âge pour nos plus jeunes pendant le service principal.',
        schedule: 'Dimanches · vers 12:00, au début du message',
      },
      {
        id: 'youth',
        icon: FLAME_ICON,
        title: 'Jeunesse',
        description: 'Un espace pour les adolescents et jeunes adultes pour grandir dans la foi, bâtir des amitiés et découvrir leur appel.',
        schedule: 'Rassemblements mensuels · ateliers · sessions de prière',
      },
      {
        id: 'couples',
        icon: HEART_HANDSHAKE_ICON,
        title: 'Couples',
        description: 'Renforcer les mariages par les Écritures, le mentorat et la conversation honnête.',
        schedule: 'Session mensuelle · ateliers trimestriels',
      },
      {
        id: 'ushering',
        icon: HANDSHAKE_ICON,
        title: 'Accueil',
        description: 'Le visage accueillant d’ICP — saluer, guider et prendre soin de chaque personne qui franchit la porte.',
      },
      {
        id: 'intercession',
        icon: HAND_HEART_ICON,
        title: 'Intercession',
        description: 'Une équipe d’intercesseurs qui porte l’église, ses membres et les familles de notre communauté dans la prière.',
        schedule: 'Samedis · 15:30 – 17:00',
      },
      {
        id: 'finance',
        icon: WALLET_ICON,
        title: 'Finance',
        description: 'Gère les dîmes, offrandes et les finances quotidiennes de l’église avec soin et transparence.',
      },
      {
        id: 'cellGroups',
        icon: HOUSE_ICON,
        title: 'Groupes de Cellule',
        description: 'De petits rassemblements à domicile à travers Pretoria — communion, discussion biblique et prière dans de vrais salons.',
        schedule: 'Hebdomadaire · PTA CBD · PTA Gardens · Sunnyside · Centurion',
      },
      {
        id: 'interpretation',
        icon: LANGUAGES_ICON,
        title: 'Interprétation',
        description: 'Traduction en direct entre les langues pour que chaque visiteur suive, peu importe d’où il vient.',
      },
      {
        id: 'mothers',
        icon: FLOWER_2_ICON,
        title: 'Mères',
        description: 'Une communion mensuelle pour les femmes — encouragement, prière et vie partagée.',
        schedule: 'Rassemblements mensuels',
      },
    ],
  },

  memoryLane: {
    eyebrow: 'Sentier des Souvenirs',
    titleLine1: 'Là où tout a',
    titleAccent: 'commencé',
    body: 'Avant les diffusions en direct. Avant ce site web. Avant les visages d’aujourd’hui. Ce sont les jours qui ont bâti ICP — des chapitres de grâce, conservés dans une lumière tamisée.',
    scrollHint: 'Marcher vers aujourd’hui',
    prevAria: 'Souvenir précédent',
    nextAria: 'Souvenir suivant',
    slideAria: 'Afficher le souvenir',
    pause: 'Mettre le diaporama en pause',
    play: 'Reprendre le diaporama',
  },

  galleryPage: {
    metaTitle: 'Galerie',
    eyebrow: 'Un Voyage Visuel',
    titleLine1: 'Notre Histoire en',
    titleAccent: 'Images',
    sub: 'Adoration, communion, action et grâce — capturées en instants. Parcourez les collections qui font la vie d’ICP.',
    intro: 'Ces photographies ne sont pas que des instantanés ; ce sont des jalons d’une famille qui se construit. Les visages, les sourires, les mains levées, les repas partagés — chaque cadre est un merci à Dieu qui a marché avec nous.',
    statPhotos: 'Photos',
    statCollections: 'Collections',
    statMemories: 'Souvenirs',
    photosLabel: 'photos',
    navLabel: 'Aller à une collection',
    categories: {
      'ICP-Youth-Ministry': {
        title: 'Ministère de la Jeunesse',
        eyebrow: 'Collection 01',
        shortLabel: 'Jeunesse',
        caption: 'La nouvelle génération qui se lève dans la foi. Soirées d’adoration, études, retraites — le cœur battant de demain à ICP.',
      },
      'ICP-Sports-Day': {
        title: 'Journée Sportive',
        eyebrow: 'Collection 02',
        shortLabel: 'Sur le terrain',
        caption: 'Compétition amicale, beaucoup de rires, et un rappel que la joie a aussi sa place à l’église.',
      },
      'ICP-Teenage-Youths': {
        title: 'Adolescents',
        eyebrow: 'Collection 03',
        shortLabel: 'Ados',
        caption: 'On y a sa place à tout âge. L’équipe des ados qui trouve sa voix, ses amis et sa foi.',
      },
      'ICP-Choir-Outing': {
        title: 'Sortie de la Chorale',
        eyebrow: 'Collection 04',
        shortLabel: 'En harmonie',
        caption: 'Les voix qui mènent notre adoration du dimanche, hors service et ensemble — communion au-delà des stalles du chœur.',
      },
    },
    closingTitle: 'Et l’histoire continue.',
    closingBody: 'Le prochain chapitre s’écrit chaque dimanche matin à 09:00. Nous serions ravis que vous soyez sur la photo.',
    closingCta: 'Venez Adorer Avec Nous',
    emptyTitle: 'Pas encore de photos dans l’archive',
    emptyDesc: 'Nous préparons cet espace. Revenez bientôt — d’autres histoires arrivent.',
  },

  notFound: {
    metaTitle: 'Page Introuvable',
    eyebrow: '404 · Page introuvable',
    titleLine1: 'Ce verset',
    titleAccent: 'n’est pas dans notre livre.',
    sub: 'La page que vous cherchiez s’est égarée. Remettons-vous sur le chemin.',
    cardTitle: 'Où aimeriez-vous aller ?',
    cardDesc: 'Recommencez depuis le début, ou venez nous rejoindre en personne ce dimanche.',
    ctaHome: 'Retour à l’accueil',
    ctaVisit: 'Planifier une visite',
  },
};

export const TRANSLATIONS = { en, fr };
