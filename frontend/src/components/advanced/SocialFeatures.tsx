import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface SocialFeature {
  id: string;
  type: 'post' | 'review' | 'photo' | 'recommendation';
  user: {
    id: string;
    name: string;
    avatar: string;
    isVerified: boolean;
  };
  content: string;
  media?: string[];
  likes: number;
  comments: number;
  shares: number;
  timestamp: Date;
  isLiked: boolean;
  product?: {
    id: string;
    name: string;
    image: string;
    price: number;
  };
}

interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
}

export const SocialFeatures: React.FC = () => {
  const [posts, setPosts] = useState<SocialFeature[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newPost, setNewPost] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);

  const fetchSocialFeed = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/social/feed', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Error fetching social feed:', error);
    }
    setLoading(false);
  };

  const likePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/social/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
            : post
        ));
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const sharePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/social/posts/${postId}/share`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        setPosts(posts.map(post => 
          post.id === postId ? { ...post, shares: post.shares + 1 } : post
        ));
        
        // Copy link to clipboard
        if (navigator.share) {
          navigator.share({
            title: 'Check out this amazing food!',
            url: `${window.location.origin}/post/${postId}`
          });
        } else {
          navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`);
          alert('Link copied to clipboard!');
        }
      }
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  const createPost = async () => {
    if (!newPost.trim()) return;

    try {
      const response = await fetch('/api/social/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          content: newPost,
          type: 'post'
        })
      });
      
      if (response.ok) {
        const post = await response.json();
        setPosts([post, ...posts]);
        setNewPost('');
        setShowCreatePost(false);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const fetchComments = async (postId: string) => {
    try {
      const response = await fetch(`/api/social/posts/${postId}/comments`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const addComment = async (postId: string) => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`/api/social/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          content: newComment
        })
      });
      
      if (response.ok) {
        const comment = await response.json();
        setComments([...comments, comment]);
        setNewComment('');
        
        // Update comment count
        setPosts(posts.map(post => 
          post.id === postId ? { ...post, comments: post.comments + 1 } : post
        ));
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  useEffect(() => {
    fetchSocialFeed();
  }, []);

  const getPostIcon = (type: string) => {
    switch (type) {
      case 'review': return '⭐';
      case 'photo': return '📸';
      case 'recommendation': return '👍';
      default: return '📝';
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Social Feed</h1>
        <Button 
          onClick={() => setShowCreatePost(true)}
          className="bg-blue-500 hover:bg-blue-600"
        >
          ✍️ Create Post
        </Button>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create New Post</h2>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md mb-4"
              placeholder="What's on your mind? Share your food experience..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              rows={4}
            />
            <div className="flex gap-2">
              <Button 
                onClick={createPost}
                className="flex-1 bg-blue-500 hover:bg-blue-600"
              >
                Post
              </Button>
              <Button 
                onClick={() => setShowCreatePost(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-600"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Social Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow border p-6">
            {/* Post Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <img
                  src={post.user.avatar || '/default-avatar.png'}
                  alt={post.user.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <div className="flex items-center">
                    <h3 className="font-semibold">{post.user.name}</h3>
                    {post.user.isVerified && (
                      <span className="ml-1 text-blue-500">✓</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{getTimeAgo(post.timestamp)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="mr-2">{getPostIcon(post.type)}</span>
                <span className="text-sm text-gray-500 capitalize">{post.type}</span>
              </div>
            </div>

            {/* Post Content */}
            <div className="mb-4">
              <p className="text-gray-800 mb-3">{post.content}</p>
              
              {/* Product Reference */}
              {post.product && (
                <div className="bg-gray-50 rounded-lg p-3 flex items-center">
                  <img
                    src={post.product.image}
                    alt={post.product.name}
                    className="w-12 h-12 rounded-lg mr-3"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{post.product.name}</h4>
                    <p className="text-sm text-gray-600">₹{post.product.price}</p>
                  </div>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-sm px-3 py-1">
                    Order Now
                  </Button>
                </div>
              )}
              
              {/* Media */}
              {post.media && post.media.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {post.media.slice(0, 4).map((media, index) => (
                    <img
                      key={index}
                      src={media}
                      alt={`Post media ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Post Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center space-x-6">
                <Button
                  onClick={() => likePost(post.id)}
                  className={`flex items-center space-x-1 ${
                    post.isLiked 
                      ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                      : 'text-gray-600 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <span>{post.isLiked ? '❤️' : '🤍'}</span>
                  <span>{post.likes}</span>
                </Button>
                
                <Button
                  onClick={() => {
                    setSelectedPost(selectedPost === post.id ? null : post.id);
                    if (selectedPost !== post.id) {
                      fetchComments(post.id);
                    }
                  }}
                  className="flex items-center space-x-1 text-gray-600 bg-gray-50 hover:bg-gray-100"
                >
                  <span>💬</span>
                  <span>{post.comments}</span>
                </Button>
                
                <Button
                  onClick={() => sharePost(post.id)}
                  className="flex items-center space-x-1 text-gray-600 bg-gray-50 hover:bg-gray-100"
                >
                  <span>🔗</span>
                  <span>{post.shares}</span>
                </Button>
              </div>
            </div>

            {/* Comments Section */}
            {selectedPost === post.id && (
              <div className="mt-4 pt-4 border-t">
                <div className="space-y-3 mb-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex items-start space-x-3">
                      <img
                        src={comment.user.avatar || '/default-avatar.png'}
                        alt={comment.user.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1 bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm">{comment.user.name}</h4>
                          <span className="text-xs text-gray-500">
                            {getTimeAgo(comment.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-800">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewComment(e.target.value)}
                    onKeyPress={(e: React.KeyboardEvent) => {
                      if (e.key === 'Enter') addComment(post.id);
                    }}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => addComment(post.id)}
                    disabled={!newComment.trim()}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Post
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="text-lg text-gray-500">Loading social feed...</div>
        </div>
      )}

      {posts.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-lg text-gray-500 mb-4">No posts yet</div>
          <p className="text-gray-400 mb-4">
            Be the first to share your food experience!
          </p>
          <Button 
            onClick={() => setShowCreatePost(true)}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Create First Post
          </Button>
        </div>
      )}
    </div>
  );
};

export default SocialFeatures;
