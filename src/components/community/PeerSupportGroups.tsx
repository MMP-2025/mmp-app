
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Users, MessageCircle, Heart, Calendar, Clock, UserPlus, Search } from 'lucide-react';
import { toast } from 'sonner';

interface SupportGroup {
  id: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  isPrivate: boolean;
  tags: string[];
  meetingTime?: string;
  moderator: string;
  lastActivity: string;
  joined: boolean;
}

const PeerSupportGroups = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const [supportGroups] = useState<SupportGroup[]>([
    {
      id: 'anxiety_support',
      name: 'Anxiety Warriors',
      description: 'A safe space for those dealing with anxiety disorders. Share coping strategies and support each other.',
      category: 'anxiety',
      memberCount: 127,
      isPrivate: false,
      tags: ['anxiety', 'coping', 'support'],
      meetingTime: 'Wednesdays 7 PM EST',
      moderator: 'Dr. Sarah Chen',
      lastActivity: '2 hours ago',
      joined: true
    },
    {
      id: 'depression_recovery',
      name: 'Journey to Light',
      description: 'Supporting each other through depression recovery with compassion and understanding.',
      category: 'depression',
      memberCount: 89,
      isPrivate: false,
      tags: ['depression', 'recovery', 'hope'],
      meetingTime: 'Sundays 6 PM EST',
      moderator: 'Michael Torres',
      lastActivity: '4 hours ago',
      joined: false
    },
    {
      id: 'workplace_stress',
      name: 'Workplace Wellness',
      description: 'Discuss workplace stress, burnout, and strategies for maintaining mental health at work.',
      category: 'stress',
      memberCount: 156,
      isPrivate: false,
      tags: ['work', 'stress', 'burnout', 'balance'],
      meetingTime: 'Fridays 12 PM EST',
      moderator: 'Lisa Rodriguez',
      lastActivity: '1 hour ago',
      joined: false
    },
    {
      id: 'mindful_living',
      name: 'Mindful Living Circle',
      description: 'Practice mindfulness together and share experiences on the journey to present-moment awareness.',
      category: 'mindfulness',
      memberCount: 203,
      isPrivate: false,
      tags: ['mindfulness', 'meditation', 'awareness'],
      meetingTime: 'Daily meditation at 7 AM EST',
      moderator: 'Zen Master Kai',
      lastActivity: '30 minutes ago',
      joined: true
    },
    {
      id: 'young_adults',
      name: 'Young Adults Mental Health',
      description: 'For young adults (18-30) navigating mental health challenges in early adulthood.',
      category: 'age_specific',
      memberCount: 94,
      isPrivate: true,
      tags: ['young_adults', 'transition', 'growth'],
      meetingTime: 'Saturdays 4 PM EST',
      moderator: 'Emma Johnson',
      lastActivity: '6 hours ago',
      joined: false
    }
  ]);

  const categories = [
    { value: 'all', label: 'All Groups' },
    { value: 'anxiety', label: 'Anxiety' },
    { value: 'depression', label: 'Depression' },
    { value: 'stress', label: 'Stress & Burnout' },
    { value: 'mindfulness', label: 'Mindfulness' },
    { value: 'age_specific', label: 'Age-Specific' }
  ];

  const filteredGroups = supportGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || group.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleJoinGroup = (groupId: string) => {
    toast.success('Group join request sent! You\'ll receive a confirmation email.');
  };

  const handleLeaveGroup = (groupId: string) => {
    toast.info('You have left the group.');
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card className="p-4 bg-white/90">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search support groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
                className="text-xs"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Support Groups List */}
      <div className="grid gap-4">
        {filteredGroups.map(group => (
          <Card key={group.id} className="p-6 bg-white/90">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold" style={{color: '#737373'}}>{group.name}</h3>
                  {group.isPrivate && (
                    <Badge variant="outline" className="text-xs">Private</Badge>
                  )}
                  {group.joined && (
                    <Badge className="text-xs bg-green-100 text-green-800">Joined</Badge>
                  )}
                </div>
                <p className="text-sm mb-3" style={{color: '#737373'}}>{group.description}</p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {group.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center gap-4 text-sm" style={{color: '#737373'}}>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {group.memberCount} members
                  </div>
                  {group.meetingTime && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {group.meetingTime}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Active {group.lastActivity}
                  </div>
                </div>
                
                <div className="mt-2 text-xs" style={{color: '#737373'}}>
                  Moderated by {group.moderator}
                </div>
              </div>
              
              <div className="flex flex-col gap-2 ml-4">
                {group.joined ? (
                  <>
                    <Button size="sm" className="bg-mental-blue hover:bg-mental-blue/80">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Join Discussion
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleLeaveGroup(group.id)}
                    >
                      Leave Group
                    </Button>
                  </>
                ) : (
                  <Button 
                    size="sm" 
                    className="bg-mental-green hover:bg-mental-green/80"
                    onClick={() => handleJoinGroup(group.id)}
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Join Group
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredGroups.length === 0 && (
        <Card className="p-8 text-center bg-white/90">
          <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2" style={{color: '#737373'}}>No groups found</h3>
          <p style={{color: '#737373'}}>
            Try adjusting your search terms or browse different categories.
          </p>
        </Card>
      )}

      {/* Create Group CTA */}
      <Card className="p-6 bg-mental-peach/20 text-center">
        <h3 className="text-lg font-semibold mb-2" style={{color: '#737373'}}>
          Don't see a group that fits your needs?
        </h3>
        <p className="mb-4" style={{color: '#737373'}}>
          Create your own support group and bring together people with similar experiences.
        </p>
        <Button className="bg-mental-peach hover:bg-mental-peach/80">
          Create New Group
        </Button>
      </Card>
    </div>
  );
};

export default PeerSupportGroups;
