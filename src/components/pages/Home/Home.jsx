import Hero from '../../sections/Hero/Hero';
import About from '../../sections/About/About';
import Ticker from '../../sections/Ticker/Ticker';
import Gallery from '../../sections/Gallery/Gallery';
import Scripture from '../../sections/Scripture/Scripture';
import Announcement from '../../sections/Announcement/Announcement';
import PastoralTeam from '../../sections/PastoralTeam/PastoralTeam';
import PastorAppointment from '../../sections/PastorAppointment/PastorAppointment';
import Sermons from '../../sections/Sermons/Sermons';
import Events from '../../sections/Events/Events';
import Map from '../../sections/Map/Map';
import Stats from '../../sections/Stats/Stats';
import Divider from '../../layout/Divider/Divider';
import Contact from '../../sections/Contact/Contact';
import PastorWelcome from '../../sections/PastorWelcome/PastorWelcome';

import { usePageTheme } from '../../../hooks/usePageTheme';

// ────────────────────────────────────────────────────────────────────
// Home page composition.
//
// The dividers carry tiny FA glyphs and act as visual breath between
// thematically distinct sections — e.g. a cross between About and
// the weekly rhythm, a dove before Scripture, a gem between Events
// and Gallery. Use sparingly so they keep their meaning.
// ────────────────────────────────────────────────────────────────────
const Home = () => {

  usePageTheme('home');

  return (
    <main id="main" tabIndex="-1">
      <Hero />
      <Ticker />
      <PastorWelcome />
      <About />
      <Stats />
      <Divider variant="cross" />
      <Announcement />
      <PastoralTeam />
      <PastorAppointment />
      <Sermons />
      <Divider variant="dot" />
      <Events />
      <Gallery />
      <Divider variant="dove" />
      <Scripture />
      <Divider variant="flame" />
      <Map />
      <Contact />
    </main>
  );
};

export default Home;
