import { transliterate } from "transliteration"

export default function normalizeVoiceText(text = "") {

  // let normalized = transliterate(text);
  let normalized = text;
  
  normalized =
  normalized.toLowerCase()

  console.log("NORNAL TRANSLARATE" , normalized);

  return normalized
}