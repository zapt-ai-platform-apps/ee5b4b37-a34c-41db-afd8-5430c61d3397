import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CountdownTimer from '../components/widgets/CountdownTimer';

vi.mock('../hooks/useAudio', () => ({
  default: () => ({
    play: vi.fn(),
    isPlaying: false
  })
}));

describe('CountdownTimer', () => {
  const mockConfig = {
    minutes: 2,
    seconds: 30,
    alert: true,
    autoStart: false
  };
  
  const mockUpdateConfig = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders with the correct initial time', () => {
    render(<CountdownTimer config={mockConfig} updateConfig={mockUpdateConfig} />);
    
    expect(screen.getByText('02:30')).toBeInTheDocument();
  });
  
  it('allows adjusting the timer settings', () => {
    render(<CountdownTimer config={mockConfig} updateConfig={mockUpdateConfig} />);
    
    // Open settings panel
    fireEvent.click(screen.getByText('Show settings'));
    
    // Increase minutes
    const plusMinutesButton = screen.getAllByText('+')[0].closest('button');
    fireEvent.click(plusMinutesButton);
    
    expect(mockUpdateConfig).toHaveBeenCalledWith(expect.objectContaining({
      minutes: 3
    }));
  });
  
  it('allows toggling sound alerts', () => {
    render(<CountdownTimer config={mockConfig} updateConfig={mockUpdateConfig} />);
    
    // Open settings panel
    fireEvent.click(screen.getByText('Show settings'));
    
    // Find and click the alert toggle
    const alertToggle = screen.getByText('Sound alert:').nextElementSibling;
    fireEvent.click(alertToggle);
    
    expect(mockUpdateConfig).toHaveBeenCalledWith(expect.objectContaining({
      alert: false
    }));
  });
});