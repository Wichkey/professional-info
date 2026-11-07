export const SECTIONS = ['Hero', 'About', 'Work', 'Projects', 'Skills', 'Education', 'Modernize', 'Contact'];

// Milliseconds after the overlay opens, mirroring storyboard frames 3 to 6.
export const UNMOUNT_START = 450;
export const UNMOUNT_STEP = 190;
export const CRT_AT = UNMOUNT_START + SECTIONS.length * UNMOUNT_STEP + 350;
export const DOT_AT = CRT_AT + 260;
export const BLACK_AT = DOT_AT + 900;
export const FINAL_AT = BLACK_AT + 600;

export const TYPE_MS_PER_CHAR = 22;
