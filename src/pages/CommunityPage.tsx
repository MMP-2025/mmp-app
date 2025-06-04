
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Users, Plus, Calendar, Smile, Frown, Meh } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MoodPost {
  id: string;
  author: string;
  avatar?: string;
  mood: 'happy' | 'sad' | 'neutral' | 'anxious' | 'excited';
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

const CommunityPage = () => {
  const [posts, setPosts] = useState<MoodPost[]>([
    {
      id: '1',
      author: 'Sarah M.',
      mood: 'happy',
      content: 'Had a great therapy session today! Feeling more confident about managing my anxiety. Remember, small steps count! 💪',
      timestamp: '2 hours ago',
      likes: 12,
      comments: 3,
      isLiked: false
    },
    {
      id: '2',
      author: 'Alex K.',
      mood: 'neutral',
      content: 'Today was okay. Some ups and downs but I practiced my breathing exercises when I felt overwhelmed. Progress, not perfection.',
      timestamp: '4 hours ago',
      likes: 8,
      comments: 1,
      isLiked: true
    },
    {
      id: '3',
      author: 'Jamie L.',
      mood: 'excited',
      content: 'One week without a panic attack! Using the coping strategies from this app has been a game changer. Thank you all for the support! 🎉',
      timestamp: '6 hours ago',
      likes: 24,
      comments: 7,
      isLiked: false
    }
  ]);

  const [newPost, setNewPost] = useState('');
  const [selectedMood, setSelectedMood] = useState<MoodPost['mood']>('neutral');
  const { toast } = useToast();

  const moodOptions = [
    { value: 'happy', label: 'Happy', icon: Smile, color: 'bg-green-100 text-green-800' },
    { value: 'sad', label: 'Sad', icon: Frown, color: 'bg-blue-100 text-blue-800' },
    { value: 'neutral', label: 'Neutral', icon: Meh, color: 'bg-gray-100 text-gray-800' },
    { value: 'anxious', label: 'Anxious', icon: Frown, color: 'bg-yellow-100 text-yellow-800' },
    { value: 'excited', label: 'Excited', icon: Smile, color: 'bg-purple-100 text-purple-800' }
  ];

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !post.isLiked 
          }
        : post
    ));
  };

  const handleSubmitPost = () => {
    if (!newPost.trim()) return;

    const post: MoodPost = {
      id: Date.now().toString(),
      author: 'You',
      mood: selectedMood,
      content: newPost,
      timestamp: 'Just now',
      likes: 0,
      comments: 0,
      isLiked: false
    };

    setPosts(prev => [post, ...prev]);
    setNewPost('');
    setSelectedMood('neutral');
    
    toast({
      title: "Post shared!",
      description: "Your mood and message have been shared with the community.",
    });
  };

  const getMoodIcon = (mood: string) => {
    const option = moodOptions.find(opt => opt.value === mood);
    return option ? option.icon : Meh;
  };

  const getMoodColor = (mood: string) => {
    const option = moodOptions.find(opt => opt.value === mood);
    return option ? option.color : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#7e868b] mb-2">Community</h1>
        <p className="text-[#7e868b]">Share your journey and connect with others in a supportive environment.</p>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold text-[#7e868b]">1,234</div>
            <div className="text-sm text-gray-600">Community Members</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold text-[#7e868b]">89</div>
            <div className="text-sm text-gray-600">Posts Today</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Heart className="h-8 w-8 mx-auto mb-2 text-red-500" />
            <div className="text-2xl font-bold text-[#7e868b]">456</div>
            <div className="text-sm text-gray-600">Support Given</div>
          </CardContent>
        </Card>
      </div>

      {/* Create New Post */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#7e868b]">
            <Plus className="h-5 w-5" />
            Share Your Mood
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#7e868b] mb-2">
              How are you feeling?
            </label>
            <div className="flex flex-wrap gap-2">
              {moodOptions.map(option => {
                const Icon = option.icon;
                return (
                  <Button
                    key={option.value}
                    variant={selectedMood === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedMood(option.value as MoodPost['mood'])}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {option.label}
                  </Button>
                );
              })}
            </div>
          </div>
          
          <Textarea
            placeholder="Share your thoughts, experiences, or words of encouragement with the community..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            rows={3}
          />
          
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">
              Remember: Be kind, supportive, and respectful. No personal information should be shared.
            </p>
            <Button onClick={handleSubmitPost} disabled={!newPost.trim()}>
              Share Post
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Community Posts */}
      <div className="space-y-4">
        {posts.map(post => {
          const MoodIcon = getMoodIcon(post.mood);
          return (
            <Card key={post.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={post.avatar} />
                    <AvatarFallback>{post.author[0]}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-[#7e868b]">{post.author}</span>
                      <Badge className={getMoodColor(post.mood)}>
                        <MoodIcon className="h-3 w-3 mr-1" />
                        {post.mood}
                      </Badge>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.timestamp}
                      </span>
                    </div>
                    
                    <p className="text-[#7e868b] mb-4">{post.content}</p>
                    
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-1 ${post.isLiked ? 'text-red-500' : 'text-gray-500'}`}
                      >
                        <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                        {post.likes}
                      </Button>
                      
                      <Button variant="ghost" size="sm" className="flex items-center gap-1 text-gray-500">
                        <MessageCircle className="h-4 w-4" />
                        {post.comments}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CommunityPage;
