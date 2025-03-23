import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TrafficLight from '../components/widgets/TrafficLight';

vi.mock('../hooks/useAudio', () => ({
  default: () => ({
    play: vi.fn(),
    isPlaying: false
  })
}));

describe('TrafficLight', () => {
  const mockConfig = {
    state: 'green',
    sound: true
  };
  
  const mockUpdateConfig = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders the correct state description', () => {
    render(<TrafficLight config={mockConfig} updateConfig={mockUpdateConfig} />);
    
    expect(screen.getByText('Free discussion and collaboration')).toBeInTheDocument();
  });
  
  it('changes state when clicking on different lights', () => {
    render(<TrafficLight config={mockConfig} updateConfig={mockUpdateConfig} />);
    
    // Click on the red light
    const redLight = screen.getByLabelText('Red - Absolute silence');
    fireEvent.click(redLight);
    
    expect(mockUpdateConfig).toHaveBeenCalledWith({ state: 'red' });
  });
  
  it('allows toggling sound', () => {
    render(<TrafficLight config={mockConfig} updateConfig={mockUpdateConfig} />);
    
    // Find and click the sound toggle
    const soundToggle = screen.getByText('Sound:').nextElementSibling;
    fireEvent.click(soundToggle);
    
    expect(mockUpdateConfig).toHaveBeenCalledWith({ sound: false });
  });
});