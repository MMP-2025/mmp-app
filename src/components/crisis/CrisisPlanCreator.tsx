
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Plus, X, Phone, Heart, Shield } from 'lucide-react';
import { StorageManager, STORAGE_KEYS } from '@/utils/storage';
import { toast } from 'sonner';

interface CrisisPlan {
  id: string;
  createdAt: number;
  warningSignsPersonal: string[];
  copingStrategies: string[];
  supportContacts: Array<{
    name: string;
    phone: string;
    relationship: string;
  }>;
  professionalContacts: Array<{
    name: string;
    phone: string;
    type: string;
  }>;
  safeEnvironment: string;
  medications: string;
  importantInfo: string;
}

const CrisisPlanCreator = () => {
  const [crisisPlan, setCrisisPlan] = useState<CrisisPlan>({
    id: '',
    createdAt: 0,
    warningSignsPersonal: [],
    copingStrategies: [],
    supportContacts: [],
    professionalContacts: [],
    safeEnvironment: '',
    medications: '',
    importantInfo: ''
  });

  const [newWarningSign, setNewWarningSign] = useState('');
  const [newCopingStrategy, setNewCopingStrategy] = useState('');
  const [newSupportContact, setNewSupportContact] = useState({ name: '', phone: '', relationship: '' });
  const [newProfessionalContact, setNewProfessionalContact] = useState({ name: '', phone: '', type: '' });

  useEffect(() => {
    const savedPlan = StorageManager.load<CrisisPlan | null>('crisis_plan', null);
    if (savedPlan) {
      setCrisisPlan(savedPlan);
    }
  }, []);

  const saveCrisisPlan = () => {
    const planToSave = {
      ...crisisPlan,
      id: crisisPlan.id || `crisis_plan_${Date.now()}`,
      createdAt: crisisPlan.createdAt || Date.now()
    };
    
    StorageManager.save('crisis_plan', planToSave);
    setCrisisPlan(planToSave);
    toast.success('Crisis plan saved successfully');
  };

  const addWarningSign = () => {
    if (newWarningSign.trim()) {
      setCrisisPlan(prev => ({
        ...prev,
        warningSignsPersonal: [...prev.warningSignsPersonal, newWarningSign.trim()]
      }));
      setNewWarningSign('');
    }
  };

  const removeWarningSign = (index: number) => {
    setCrisisPlan(prev => ({
      ...prev,
      warningSignsPersonal: prev.warningSignsPersonal.filter((_, i) => i !== index)
    }));
  };

  const addCopingStrategy = () => {
    if (newCopingStrategy.trim()) {
      setCrisisPlan(prev => ({
        ...prev,
        copingStrategies: [...prev.copingStrategies, newCopingStrategy.trim()]
      }));
      setNewCopingStrategy('');
    }
  };

  const removeCopingStrategy = (index: number) => {
    setCrisisPlan(prev => ({
      ...prev,
      copingStrategies: prev.copingStrategies.filter((_, i) => i !== index)
    }));
  };

  const addSupportContact = () => {
    if (newSupportContact.name && newSupportContact.phone) {
      setCrisisPlan(prev => ({
        ...prev,
        supportContacts: [...prev.supportContacts, newSupportContact]
      }));
      setNewSupportContact({ name: '', phone: '', relationship: '' });
    }
  };

  const removeSupportContact = (index: number) => {
    setCrisisPlan(prev => ({
      ...prev,
      supportContacts: prev.supportContacts.filter((_, i) => i !== index)
    }));
  };

  const addProfessionalContact = () => {
    if (newProfessionalContact.name && newProfessionalContact.phone) {
      setCrisisPlan(prev => ({
        ...prev,
        professionalContacts: [...prev.professionalContacts, newProfessionalContact]
      }));
      setNewProfessionalContact({ name: '', phone: '', type: '' });
    }
  };

  const removeProfessionalContact = (index: number) => {
    setCrisisPlan(prev => ({
      ...prev,
      professionalContacts: prev.professionalContacts.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-6 w-6 text-red-600" />
          <h2 className="text-xl font-semibold text-red-800">Personal Crisis Plan</h2>
        </div>
        <p className="text-red-700 mb-4">
          Create a personalized plan to help you recognize warning signs and know what to do during a crisis.
        </p>
        <div className="bg-red-100 p-4 rounded-md">
          <p className="text-sm text-red-800">
            <strong>Important:</strong> This plan is not a substitute for professional help. 
            In immediate danger, call emergency services or crisis hotlines.
          </p>
        </div>
      </Card>

      {/* Warning Signs */}
      <Card className="p-6 bg-white/90">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Personal Warning Signs
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Identify early signs that indicate you might be entering a crisis state.
        </p>
        
        <div className="space-y-3">
          {crisisPlan.warningSignsPersonal.map((sign, index) => (
            <div key={index} className="flex items-center gap-2">
              <Badge variant="outline" className="flex-1 justify-start">
                {sign}
              </Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => removeWarningSign(index)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <div className="flex gap-2">
            <Input
              placeholder="e.g., Feeling overwhelmed, trouble sleeping..."
              value={newWarningSign}
              onChange={(e) => setNewWarningSign(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addWarningSign()}
            />
            <Button onClick={addWarningSign}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Coping Strategies */}
      <Card className="p-6 bg-white/90">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Heart className="h-5 w-5 text-green-500" />
          Coping Strategies
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          List strategies that have helped you cope with difficult times.
        </p>
        
        <div className="space-y-3">
          {crisisPlan.copingStrategies.map((strategy, index) => (
            <div key={index} className="flex items-center gap-2">
              <Badge variant="outline" className="flex-1 justify-start bg-green-50">
                {strategy}
              </Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => removeCopingStrategy(index)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <div className="flex gap-2">
            <Input
              placeholder="e.g., Deep breathing, call a friend, go for a walk..."
              value={newCopingStrategy}
              onChange={(e) => setNewCopingStrategy(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCopingStrategy()}
            />
            <Button onClick={addCopingStrategy}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Support Contacts */}
      <Card className="p-6 bg-white/90">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Phone className="h-5 w-5 text-blue-500" />
          Support Contacts
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          People you trust and can reach out to for support.
        </p>
        
        <div className="space-y-3">
          {crisisPlan.supportContacts.map((contact, index) => (
            <div key={index} className="flex items-center gap-2 p-3 bg-blue-50 rounded-md">
              <div className="flex-1">
                <div className="font-medium">{contact.name}</div>
                <div className="text-sm text-gray-600">{contact.phone}</div>
                <div className="text-xs text-gray-500">{contact.relationship}</div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => removeSupportContact(index)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Input
              placeholder="Name"
              value={newSupportContact.name}
              onChange={(e) => setNewSupportContact(prev => ({ ...prev, name: e.target.value }))}
            />
            <Input
              placeholder="Phone number"
              value={newSupportContact.phone}
              onChange={(e) => setNewSupportContact(prev => ({ ...prev, phone: e.target.value }))}
            />
            <div className="flex gap-2">
              <Input
                placeholder="Relationship"
                value={newSupportContact.relationship}
                onChange={(e) => setNewSupportContact(prev => ({ ...prev, relationship: e.target.value }))}
              />
              <Button onClick={addSupportContact}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Professional Contacts */}
      <Card className="p-6 bg-white/90">
        <h3 className="text-lg font-semibold mb-4">Professional Support</h3>
        
        <div className="space-y-3">
          {crisisPlan.professionalContacts.map((contact, index) => (
            <div key={index} className="flex items-center gap-2 p-3 bg-purple-50 rounded-md">
              <div className="flex-1">
                <div className="font-medium">{contact.name}</div>
                <div className="text-sm text-gray-600">{contact.phone}</div>
                <div className="text-xs text-gray-500">{contact.type}</div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => removeProfessionalContact(index)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Input
              placeholder="Provider name"
              value={newProfessionalContact.name}
              onChange={(e) => setNewProfessionalContact(prev => ({ ...prev, name: e.target.value }))}
            />
            <Input
              placeholder="Phone number"
              value={newProfessionalContact.phone}
              onChange={(e) => setNewProfessionalContact(prev => ({ ...prev, phone: e.target.value }))}
            />
            <div className="flex gap-2">
              <Input
                placeholder="Type (therapist, doctor, etc.)"
                value={newProfessionalContact.type}
                onChange={(e) => setNewProfessionalContact(prev => ({ ...prev, type: e.target.value }))}
              />
              <Button onClick={addProfessionalContact}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Additional Information */}
      <Card className="p-6 bg-white/90">
        <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="safeEnvironment">Safe Environment Plan</Label>
            <Textarea
              id="safeEnvironment"
              placeholder="Describe what makes you feel safe and secure..."
              value={crisisPlan.safeEnvironment}
              onChange={(e) => setCrisisPlan(prev => ({ ...prev, safeEnvironment: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="medications">Current Medications</Label>
            <Textarea
              id="medications"
              placeholder="List any medications you're currently taking..."
              value={crisisPlan.medications}
              onChange={(e) => setCrisisPlan(prev => ({ ...prev, medications: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="importantInfo">Other Important Information</Label>
            <Textarea
              id="importantInfo"
              placeholder="Any other information that would be helpful in a crisis..."
              value={crisisPlan.importantInfo}
              onChange={(e) => setCrisisPlan(prev => ({ ...prev, importantInfo: e.target.value }))}
            />
          </div>
        </div>
      </Card>

      <Button onClick={saveCrisisPlan} className="w-full bg-red-600 hover:bg-red-700 text-white">
        Save Crisis Plan
      </Button>
    </div>
  );
};

export default CrisisPlanCreator;
