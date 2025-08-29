import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { 
  Mic, MicOff, Camera, Upload, Play, Pause, Volume2, VolumeX, 
  Eye, EyeOff, MessageCircle, Heart, Share2, ArrowLeft, ArrowRight,
  Filter, Search, Zap, Star
} from 'lucide-react';

interface MediaFile {
  id: string;
  url: string;
  type: 'image' | 'video' | 'audio';
  title: string;
  description: string;
  tags: string[];
  likes: number;
  isLiked: boolean;
  uploadedAt: Date;
  user: {
    name: string;
    avatar: string;
  };
}

const VoiceAndMultimediaHub: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [voiceCommand, setVoiceCommand] = useState('');

  // Initialize voice recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event: any) => {
        const command = event.results[0][0].transcript.toLowerCase();
        setVoiceCommand(command);
        processVoiceCommand(command);
      };
      
      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };
      
      recognitionInstance.onend = () => {
        setIsRecording(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);

  // Load sample media files
  useEffect(() => {
    const sampleFiles: MediaFile[] = [
      {
        id: '1',
        url: '/api/uploads/media/food1.jpg',
        type: 'image',
        title: 'Delicious Biryani',
        description: 'Authentic Hyderabadi Biryani with aromatic spices',
        tags: ['spicy', 'biryani', 'indian'],
        likes: 234,
        isLiked: false,
        uploadedAt: new Date(),
        user: { name: 'Chef Ramesh', avatar: '/avatars/chef1.jpg' }
      },
      {
        id: '2',
        url: '/api/uploads/media/cooking1.mp4',
        type: 'video',
        title: 'Behind the Scenes Cooking',
        description: 'Watch how our chefs prepare fresh meals',
        tags: ['cooking', 'behind-scenes', 'fresh'],
        likes: 156,
        isLiked: true,
        uploadedAt: new Date(),
        user: { name: 'Kitchen Team', avatar: '/avatars/kitchen.jpg' }
      },
      {
        id: '3',
        url: '/api/uploads/media/review1.mp3',
        type: 'audio',
        title: 'Customer Review - Amazing Taste!',
        description: 'Happy customer sharing their experience',
        tags: ['review', 'positive', 'taste'],
        likes: 89,
        isLiked: false,
        uploadedAt: new Date(),
        user: { name: 'Sarah Johnson', avatar: '/avatars/customer1.jpg' }
      }
    ];
    setMediaFiles(sampleFiles);
  }, []);

  const processVoiceCommand = (command: string) => {
    console.log('Processing voice command:', command);
    
    if (command.includes('search') || command.includes('find')) {
      const searchTerm = command.replace(/search|find/g, '').trim();
      setSearchQuery(searchTerm);
    } else if (command.includes('like')) {
      // Like the first visible item
      const firstItem = filteredMediaFiles[0];
      if (firstItem) {
        toggleLike(firstItem.id);
      }
    } else if (command.includes('play')) {
      // Play the first video/audio item
      const firstPlayable = filteredMediaFiles.find(item => 
        item.type === 'video' || item.type === 'audio'
      );
      if (firstPlayable) {
        setCurrentPlayingId(firstPlayable.id);
      }
    } else if (command.includes('stop') || command.includes('pause')) {
      setCurrentPlayingId(null);
    } else if (command.includes('camera')) {
      toggleCamera();
    } else if (command.includes('upload')) {
      document.getElementById('file-upload')?.click();
    }
  };

  const startVoiceRecording = () => {
    if (recognition) {
      setIsRecording(true);
      recognition.start();
    }
  };

  const stopVoiceRecording = () => {
    if (recognition) {
      recognition.stop();
    }
    setIsRecording(false);
  };

  const toggleCamera = async () => {
    if (showCamera && cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
      setShowCamera(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        setCameraStream(stream);
        setShowCamera(true);
      } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Unable to access camera. Please check permissions.');
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('media', file);
      
      const response = await fetch('/api/multimedia/media/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      
      const result = await response.json();
      
      if (result.success) {
        const newFile: MediaFile = {
          id: Date.now().toString(),
          url: result.url,
          type: file.type.startsWith('image/') ? 'image' : 
                file.type.startsWith('video/') ? 'video' : 'audio',
          title: file.name,
          description: `Uploaded ${file.type}`,
          tags: ['user-upload'],
          likes: 0,
          isLiked: false,
          uploadedAt: new Date(),
          user: { name: 'You', avatar: '/avatars/default.jpg' }
        };
        
        setMediaFiles(prev => [newFile, ...prev]);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const toggleLike = (id: string) => {
    setMediaFiles(prev => prev.map(file => 
      file.id === id 
        ? { ...file, isLiked: !file.isLiked, likes: file.isLiked ? file.likes - 1 : file.likes + 1 }
        : file
    ));
  };

  const filteredMediaFiles = mediaFiles.filter(file => {
    const matchesFilter = selectedFilter === 'all' || file.type === selectedFilter;
    const matchesSearch = searchQuery === '' || 
      file.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Voice & Multimedia Hub
        </h1>
        <p className="text-lg text-gray-600">
          Upload, manage, and interact with multimedia content using voice commands
        </p>
      </div>

      {/* Voice Command Panel */}
      <div className="border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Voice Commands
          </h3>
          <p className="text-sm text-gray-600 mt-2">
            Try saying: "search biryani", "like this", "play video", "open camera", or "upload file"
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
            variant={isRecording ? "danger" : "primary"}
            className="flex items-center gap-2"
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {isRecording ? 'Stop Recording' : 'Start Voice Command'}
          </Button>
          
          {voiceCommand && (
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
              Last command: "{voiceCommand}"
            </span>
          )}
        </div>
      </div>

      {/* Upload and Camera Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Upload className="h-5 w-5" />
            Upload Media
          </h3>
          <div className="space-y-4">
            <input
              id="file-upload"
              type="file"
              accept="image/*,video/*,audio/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              onClick={() => document.getElementById('file-upload')?.click()}
              disabled={isUploading}
              className="w-full"
            >
              {isUploading ? 'Uploading...' : 'Choose File to Upload'}
            </Button>
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Camera className="h-5 w-5" />
            Camera Access
          </h3>
          <Button
            onClick={toggleCamera}
            variant={showCamera ? "danger" : "primary"}
            className="w-full flex items-center gap-2"
          >
            {showCamera ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showCamera ? 'Close Camera' : 'Open Camera'}
          </Button>
        </div>
      </div>

      {/* Camera View */}
      {showCamera && (
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Live Camera Feed</h3>
          <video
            ref={(video) => {
              if (video && cameraStream) {
                video.srcObject = cameraStream;
                video.play();
              }
            }}
            className="w-full max-w-md mx-auto rounded-lg"
            autoPlay
            muted
          />
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search multimedia content..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          {['all', 'image', 'video', 'audio'].map((filter) => (
            <Button
              key={filter}
              variant={selectedFilter === filter ? "primary" : "secondary"}
              onClick={() => setSelectedFilter(filter)}
              className="capitalize"
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMediaFiles.map((file) => (
          <div key={file.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="relative">
              {file.type === 'image' && (
                <img
                  src={file.url}
                  alt={file.title}
                  className="w-full h-48 object-cover"
                />
              )}
              
              {file.type === 'video' && (
                <div className="relative">
                  <video
                    src={file.url}
                    className="w-full h-48 object-cover"
                    controls={currentPlayingId === file.id}
                  />
                  <Button
                    onClick={() => setCurrentPlayingId(
                      currentPlayingId === file.id ? null : file.id
                    )}
                    className="absolute inset-0 bg-black/50 text-white opacity-0 hover:opacity-100 transition-opacity"
                  >
                    {currentPlayingId === file.id ? <Pause /> : <Play />}
                  </Button>
                </div>
              )}
              
              {file.type === 'audio' && (
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Button
                    onClick={() => setCurrentPlayingId(
                      currentPlayingId === file.id ? null : file.id
                    )}
                    className="bg-white/20 text-white hover:bg-white/30"
                  >
                    {currentPlayingId === file.id ? <VolumeX /> : <Volume2 />}
                  </Button>
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{file.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{file.description}</p>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {file.tags.map((tag) => (
                  <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <img
                    src={file.user.avatar}
                    alt={file.user.name}
                    className="w-6 h-6 rounded-full"
                  />
                  {file.user.name}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => toggleLike(file.id)}
                    className={`text-sm ${file.isLiked ? "text-red-500" : "text-gray-500"}`}
                  >
                    <Heart className={`h-4 w-4 ${file.isLiked ? 'fill-current' : ''}`} />
                    {file.likes}
                  </Button>
                  
                  <Button size="sm" className="text-gray-500 text-sm">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                  
                  <Button size="sm" className="text-gray-500 text-sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMediaFiles.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Upload className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No media files found
          </h3>
          <p className="text-gray-500">
            {searchQuery || selectedFilter !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Upload your first media file to get started'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default VoiceAndMultimediaHub;
