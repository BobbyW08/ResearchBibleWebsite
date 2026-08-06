export type Testimonial = {
  quote: string;
  attribution: string;
};

// From the CPRS parent feedback survey (Jul–Aug 2026). Real, lightly-trimmed
// parent responses. Do not paraphrase further. Attribution is anonymized by
// design — consent to publish, even anonymized, should be confirmed before
// this ships (peer support + DCYF-involved families is consent-sensitive).
export const testimonials: Testimonial[] = [
  {
    quote:
      "If we didn't have Bobby I don't know if we would be where we are. Yes, we still have blips — but we now feel like we can move past our blips instead of the blips dragging on.",
    attribution: "Parent of a teen · Rhode Island",
  },
  {
    quote:
      "It feels easier to be heard and seen by someone that isn't 'clinical.' Feeling heard and seen by someone that has experienced similar or same experiences is a welcomed relief.",
    attribution: "Parent of a son · Rhode Island",
  },
  {
    quote:
      "All the years of therapy with my kid, no one ever spent as much time with me as with my kiddo. Which HELPED my kid — because I was feeling seen and supported.",
    attribution: "Parent · Rhode Island",
  },
  {
    quote:
      "To be blunt? You called me out on my crap — which I needed you to do. Any question I had, if you didn't have an answer you got an answer for me. I always felt like you were in my corner.",
    attribution: "Parent of school-age kids · Rhode Island",
  },
  {
    quote: "I have a lot more confidence as a parent. I feel more connected and in charge.",
    attribution: "Parent · Rhode Island",
  },
  {
    quote:
      "You pull stuff out of my rants that help me see what exactly I am struggling with, and give me options and examples of solutions. I didn't even know what having values meant before.",
    attribution: "Parent of a teen · Rhode Island",
  },
  {
    quote:
      "Giving me something productive to do for myself gave me a sense of control when everything seemed out of control.",
    attribution: "Parent of a son · Rhode Island",
  },
  {
    quote: "We would have loved to have Bobby in our corner years ago, and for a longer period of time.",
    attribution: "Parent · Rhode Island",
  },
  {
    quote:
      "We still use the diagrams and lists you helped make. We hold family meetings and make sure everyone is heard. It made us communicate differently and more effectively.",
    attribution: "Parent, one year out · Rhode Island",
  },
];
