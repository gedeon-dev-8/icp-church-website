import Hero from '../../sections/Hero/Hero';
import About from '../../sections/About/About';
import Ticker from '../../sections/Ticker/Ticker';
import Gallery from '../../sections/Gallery/Gallery';
import Scripture from '../../sections/Scripture/Scripture';
import Announcement from '../../sections/Announcement/Announcement';
import Sermons from '../../sections/Sermons/Sermons';
import Events from '../../sections/Events/Events';
import Map from '../../sections/Map/Map';
import Stats from '../../sections/Stats/Stats';
import Divider from '../../layout/Divider/Divider';

// ────────────────────────────────────────────────────────────────────
// Home page composition.
//
// The dividers carry tiny FA glyphs and act as visual breath between
// thematically distinct sections — e.g. a cross between About and
// the weekly rhythm, a dove before Scripture, a gem between Events
// and Gallery. Use sparingly so they keep their meaning.
// ────────────────────────────────────────────────────────────────────
const Home = () => {
  return (
    <main id="main" tabIndex="-1">
      <Hero />
      <Ticker />
      <About />
      <Stats />
      <Divider variant="cross" />
      <Announcement />
      <Sermons />
      <Divider variant="dot" />
      <Events />
      <Gallery />
      <Divider variant="dove" />
      <Scripture />
      <Divider variant="flame" />
      <Map />
    </main>
  );
};

export default Home;
