import { supabase } from "../lib/initSupabase";

import Welcome from "../components/welcome";

export default function Home() {
  return <Welcome />;
}

// TODO: get rid of all the JSON.parse stuff with pixelArt.pixels
// TODO: Refactor the whole codebase, it is messy
