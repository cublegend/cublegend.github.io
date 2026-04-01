const noteToChar = {
  "A#": "h",
  "F#": "G",
  "D": "e",
  "G#": "W",
  "C": "B",
  "C#": "4",
  "A": "s",
  "G": "b",
  "Bb": "c"
};

// Number mapping for puzzle input.
// Center C is 0, C# is 1. Supports 0-13 to match game instructions.
const numberToNote = {
  0: "C",
  1: "C#",
  2: "D",
  3: "D#",
  4: "E",
  5: "F",
  6: "F#",
  7: "G",
  8: "G#",
  9: "A",
  10: "A#",
  11: "B"
};

function normalizeNote(note) {
  if (note === "Bb") {
    return "A#";
  }
  return note;
}

function decodeNumberArrayToString(noteNumbers) {
  return noteNumbers.map((value) => {
    if (!Number.isInteger(value)) {
      throw new Error(`Invalid note number: "${value}"`);
    }

    const mappedNote = numberToNote[value];
    if (!mappedNote) {
      throw new Error(`Unsupported note number: "${value}". Use numbers from 0 to 13.`);
    }

    const normalizedNote = normalizeNote(mappedNote);
    const decodedChar = noteToChar[normalizedNote];
    if (!decodedChar) {
      throw new Error(`No decoder mapping for note "${normalizedNote}" from number "${value}".`);
    }
    return decodedChar;
  }).join("");
}

function parseNumberString(input) {
  if (typeof input !== "string") {
    throw new Error("Input must be a string of numbers separated by spaces.");
  }

  const tokens = input.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) {
    throw new Error("Please enter at least one note number.");
  }

  return tokens.map((token) => {
    const parsed = Number.parseInt(token, 10);
    if (Number.isNaN(parsed)) {
      throw new Error(`Invalid token "${token}". Use numbers separated by spaces.`);
    }
    return parsed;
  });
}

// Intentionally named as requested.
window.noteEncder = {
  decodeNumberArrayToString,
  decodeNumberString(input) {
    const noteNumbers = parseNumberString(input);
    return decodeNumberArrayToString(noteNumbers);
  }
};