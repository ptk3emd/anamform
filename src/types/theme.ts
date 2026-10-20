/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Theme and Display Settings matching Typeform DESIGN.md & UI Kit
 */

export interface ThemeConfig {
  fontFamily: 'serif' | 'sans' | 'system';
  brandColor: string; // e.g. '#2A222B', '#198754', '#006BFF', '#EF6451'
  bgColor: string; // e.g. '#F6F4EF', '#FFFFFF', '#141416'
  questionSize: 'sm' | 'md' | 'lg';
  welcomeSize: 'sm' | 'md' | 'lg';
  alignment: 'left' | 'center';
  autoAdvanceOnSingleChoice: boolean;
  soundEffects: boolean;
}

export const DEFAULT_THEME: ThemeConfig = {
  fontFamily: 'serif',
  brandColor: '#2A222B',
  bgColor: '#F6F4EF',
  questionSize: 'md',
  welcomeSize: 'lg',
  alignment: 'left',
  autoAdvanceOnSingleChoice: true,
  soundEffects: false,
};
