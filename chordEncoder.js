// Canonical sharp-based note mapping
const noteToChar = {
    "A#": "g",
    "F#": "H",
    "D": "f",
    "G#": "c",
    "C": "k",
    "C#": "V",
    "A": "N",
    "G": "C"
  };
  
  // Flat aliases -> sharp equivalents
  const flatToSharp = {
    "Bb": "A#",
    "Gb": "F#",
    "Eb": "D#",
    "Ab": "G#",
    "Db": "C#"
  };
  
  // Build reverse map for decoding
  const charToNote = new Map();
  for (const [note, char] of Object.entries(noteToChar)) {
    if (charToNote.has(char)) {
      throw new Error(`Duplicate character mapping found for "${char}"`);
    }
    charToNote.set(char, note);
  }
  
  function normalizeNote(note) {
    if (typeof note !== "string") {
      throw new Error(`Invalid note: ${note}`);
    }
  
    const trimmed = note.trim();
  
    if (flatToSharp[trimmed]) {
      return flatToSharp[trimmed];
    }
  
    return trimmed;
  }
  
  function encodeNotesToString(notes, separator = "") {
    return notes.map(note => {
      const normalized = normalizeNote(note);
      const char = noteToChar[normalized];
  
      if (!char) {
        throw new Error(`Unsupported note: "${note}" (normalized: "${normalized}")`);
      }
  
      return char;
    }).join(separator);
  }
  
  function decodeStringToNotes(text) {
    return [...text].map(char => {
      const note = charToNote.get(char);
  
      if (!note) {
        throw new Error(`Unsupported character: "${char}"`);
      }
  
      return note;
    });
  }
  
  // Optional helper if you want a spaced note string on decode
  function decodeStringToNoteString(text, separator = " ") {
    return decodeStringToNotes(text).join(separator);
  }
  
  // Example usage:
  const notes1 = ["A#", "F#", "D", "G#", "C", "C#", "A#", "A", "G"];
  console.log(encodeNotesToString(notes1)); 
  // gHfckVgNC
  
  const notes2 = ["Bb", "Gb", "D", "Ab", "C", "Db", "Bb", "A", "G"];
  console.log(encodeNotesToString(notes2)); 
  // gHfckVgNC
  
  console.log(decodeStringToNotes("gHfckVgNC"));
  // [ 'A#', 'F#', 'D', 'G#', 'C', 'C#', 'A#', 'A', 'G' ]
  
  console.log(decodeStringToNoteString("gHfckVgNC"));
  // A# F# D G# C C# A# A G