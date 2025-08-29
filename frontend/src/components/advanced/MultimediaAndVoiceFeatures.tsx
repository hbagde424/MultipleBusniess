import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface VoiceCommand {
  command: string;
  action: string;
  confidence: number;
}

interface MultimediaContent {
  type: 'image' | 'video' | 'audio';
  url: string;
  caption?: string;
  tags: string[];
}

interface ARFeature {
  isSupported: boolean;
  isActive: boolean;
  overlayItems: {
    id: string;
    type: 'nutrition' | 'ingredients' | 'allergens';
    position: { x: number; y: number };
    content: string;
  }[];
}

export const MultimediaAndVoiceFeatures: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [voiceCommand, setVoiceCommand] = useState<VoiceCommand | null>(null);
  const [mediaContent, setMediaContent] = useState<MultimediaContent[]>([]);
  const [arFeature, setArFeature] = useState<ARFeature>({
    isSupported: false,
    isActive: false,
    overlayItems: []
  });
  const [selectedMedia, setSelectedMedia] = useState<MultimediaContent | null>(null);

  // Voice Recognition Setup
  const recognition = typeof window !== 'undefined' && 'webkitSpeechRecognition' in window 
    ? new (window as any).webkitSpeechRecognition() 
    : null;

  useEffect(() => {
    if (recognition) {
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const command = event.results[0][0].transcript;
        const confidence = event.results[0][0].confidence;
        
        processVoiceCommand(command, confidence);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    }

    // Check AR support
    if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
      setArFeature(prev => ({ ...prev, isSupported: true }));
    }
  }, []);

  const processVoiceCommand = async (command: string, confidence: number) => {
    const lowerCommand = command.toLowerCase();
    let action = '';

    // Voice command parsing
    if (lowerCommand.includes('search') || lowerCommand.includes('find')) {
      const searchTerm = lowerCommand.replace(/search|find/gi, '').trim();
      action = `search_${searchTerm}`;
    } else if (lowerCommand.includes('add to cart')) {
      action = 'add_to_cart';
    } else if (lowerCommand.includes('order') || lowerCommand.includes('buy')) {
      action = 'place_order';
    } else if (lowerCommand.includes('show menu')) {
      action = 'show_menu';
    } else if (lowerCommand.includes('my orders')) {
      action = 'show_orders';
    } else {
      action = 'unknown';
    }

    const voiceCmd: VoiceCommand = {
      command,
      action,
      confidence
    };

    setVoiceCommand(voiceCmd);
    await executeVoiceCommand(voiceCmd);
  };

  const executeVoiceCommand = async (cmd: VoiceCommand) => {
    try {
      const response = await fetch('/api/voice/command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(cmd)
      });

      if (response.ok) {
        const result = await response.json();
        handleCommandResult(result);
      }
    } catch (error) {
      console.error('Error executing voice command:', error);
    }
  };

  const handleCommandResult = (result: any) => {
    switch (result.action) {
      case 'search':
        // Navigate to search page with query
        window.location.href = `/search?q=${encodeURIComponent(result.query)}`;
        break;
      case 'add_to_cart':
        alert('Item added to cart via voice command!');
        break;
      case 'show_menu':
        window.location.href = '/menu';
        break;
      default:
        console.log('Command executed:', result);
    }
  };

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const uploadMedia = async (file: File) => {
    const formData = new FormData();
    formData.append('media', file);

    try {
      const response = await fetch('/api/media/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        const newMedia: MultimediaContent = {
          type: file.type.startsWith('video/') ? 'video' : 
                file.type.startsWith('audio/') ? 'audio' : 'image',
          url: result.url,
          caption: '',
          tags: []
        };
        setMediaContent([...mediaContent, newMedia]);
      }
    } catch (error) {
      console.error('Error uploading media:', error);
    }
  };

  const activateAR = async () => {
    if (!arFeature.isSupported) {
      alert('AR is not supported on this device');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      setArFeature(prev => ({ ...prev, isActive: true }));
      
      // Simulate AR overlay data
      const mockOverlays = [
        {
          id: '1',
          type: 'nutrition' as const,
          position: { x: 50, y: 50 },
          content: 'Calories: 350 | Protein: 15g | Carbs: 45g'
        },
        {
          id: '2', 
          type: 'ingredients' as const,
          position: { x: 30, y: 70 },
          content: 'Rice, Chicken, Vegetables, Spices'
        }
      ];
      
      setArFeature(prev => ({ ...prev, overlayItems: mockOverlays }));
    } catch (error) {
      console.error('Error activating AR:', error);
      alert('Could not access camera for AR features');
    }
  };

  const deactivateAR = () => {
    setArFeature(prev => ({ 
      ...prev, 
      isActive: false, 
      overlayItems: [] 
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Multimedia & Voice Features</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Voice Commands Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">🎤 Voice Commands</h2>
          
          <div className="mb-6">
            <Button
              onClick={isListening ? stopListening : startListening}
              className={`w-full py-4 text-lg ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isListening ? (
                <>🔴 Listening... (Tap to stop)</>
              ) : (
                <>🎤 Start Voice Command</>
              )}
            </Button>
          </div>

          {voiceCommand && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-medium mb-2">Last Command:</h3>
              <p className="text-gray-700">"{voiceCommand.command}"</p>
              <p className="text-sm text-gray-500 mt-1">
                Confidence: {(voiceCommand.confidence * 100).toFixed(0)}%
              </p>
              <p className="text-sm text-blue-600 mt-1">
                Action: {voiceCommand.action.replace('_', ' ')}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="font-medium">Try these commands:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• "Search for pizza"</li>
              <li>• "Add to cart"</li>
              <li>• "Show my orders"</li>
              <li>• "Show menu"</li>
              <li>• "Place order"</li>
            </ul>
          </div>
        </div>

        {/* AR Features Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">🥽 Augmented Reality</h2>
          
          <div className="mb-6">
            <Button
              onClick={arFeature.isActive ? deactivateAR : activateAR}
              disabled={!arFeature.isSupported}
              className={`w-full py-4 text-lg ${
                arFeature.isActive 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {!arFeature.isSupported ? (
                <>📱 AR Not Supported</>
              ) : arFeature.isActive ? (
                <>📹 Deactivate AR</>
              ) : (
                <>🥽 Activate AR View</>
              )}
            </Button>
          </div>

          {arFeature.isActive && (
            <div className="relative bg-gray-900 rounded-lg h-64 mb-4">
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <span>📹 AR Camera View</span>
              </div>
              
              {/* AR Overlays */}
              {arFeature.overlayItems.map((item) => (
                <div
                  key={item.id}
                  className="absolute bg-blue-500 text-white p-2 rounded-lg text-xs"
                  style={{
                    left: `${item.position.x}%`,
                    top: `${item.position.y}%`
                  }}
                >
                  <div className="font-semibold capitalize">{item.type}</div>
                  <div>{item.content}</div>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <h3 className="font-medium">AR Features:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Point camera at food for nutrition info</li>
              <li>• View ingredients and allergens</li>
              <li>• See reviews and ratings overlay</li>
              <li>• Virtual menu placement</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Media Gallery */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">📸 Media Gallery</h2>
          <div className="flex gap-2">
            <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
              📷 Upload Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && uploadMedia(e.target.files[0])}
              />
            </label>
            <label className="cursor-pointer bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg">
              🎥 Upload Video
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && uploadMedia(e.target.files[0])}
              />
            </label>
            <label className="cursor-pointer bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
              🎵 Upload Audio
              <input
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && uploadMedia(e.target.files[0])}
              />
            </label>
          </div>
        </div>

        {mediaContent.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mediaContent.map((media, index) => (
              <div 
                key={index}
                className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100"
                onClick={() => setSelectedMedia(media)}
              >
                {media.type === 'image' && (
                  <img
                    src={media.url}
                    alt="Uploaded content"
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                )}
                {media.type === 'video' && (
                  <video
                    src={media.url}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                    controls
                  />
                )}
                {media.type === 'audio' && (
                  <div className="w-full h-32 bg-gray-200 rounded-lg mb-2 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl mb-2">🎵</div>
                      <audio src={media.url} controls className="w-full" />
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 capitalize">{media.type}</span>
                  <div className="flex gap-1">
                    {media.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">📁</div>
            <p>No media uploaded yet</p>
            <p className="text-sm">Upload images, videos, or audio to get started</p>
          </div>
        )}
      </div>

      {/* Media Preview Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full m-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Media Preview</h3>
              <Button
                onClick={() => setSelectedMedia(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white"
              >
                ✕
              </Button>
            </div>
            
            {selectedMedia.type === 'image' && (
              <img
                src={selectedMedia.url}
                alt="Preview"
                className="w-full max-h-96 object-contain rounded-lg"
              />
            )}
            {selectedMedia.type === 'video' && (
              <video
                src={selectedMedia.url}
                className="w-full max-h-96 rounded-lg"
                controls
                autoPlay
              />
            )}
            {selectedMedia.type === 'audio' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎵</div>
                <audio src={selectedMedia.url} controls className="w-full" autoPlay />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultimediaAndVoiceFeatures;
