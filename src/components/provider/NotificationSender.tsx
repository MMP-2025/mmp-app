import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Send, Users, User, Clock, Calendar, Loader2 } from 'lucide-react';
import { useProviderPatients } from '@/hooks/useProviderPatients';
import { useProviderNotifications, type Notification } from '@/hooks/useProviderNotifications';

const NotificationSender: React.FC = () => {
  const { patients, loading: patientsLoading } = useProviderPatients();
  const { sendNotification, sendBulkNotifications, sending } = useProviderNotifications();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<Notification['type']>('general');
  const [priority, setPriority] = useState<Notification['priority']>('medium');
  const [targetMode, setTargetMode] = useState<'all' | 'single' | 'bulk'>('all');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [selectedPatientIds, setSelectedPatientIds] = useState<string[]>([]);
  const [actionUrl, setActionUrl] = useState('');
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('09:00');

  const handlePatientToggle = (patientId: string) => {
    setSelectedPatientIds(prev =>
      prev.includes(patientId)
        ? prev.filter(id => id !== patientId)
        : [...prev, patientId]
    );
  };

  const selectAllPatients = () => {
    setSelectedPatientIds(patients.map(p => p.id));
  };

  const deselectAllPatients = () => {
    setSelectedPatientIds([]);
  };

  const getScheduledAt = (): string | null => {
    if (!scheduleEnabled || !scheduledDate) return null;
    return `${scheduledDate}T${scheduledTime}:00.000Z`;
  };

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) return;

    const baseData = {
      title: title.trim(),
      message: message.trim(),
      type,
      priority,
      action_url: actionUrl.trim() || undefined,
      scheduled_at: getScheduledAt(),
    };

    let success = false;

    if (targetMode === 'all') {
      // Send to all patients (patient_id = null)
      success = await sendNotification({ ...baseData, patient_id: null });
    } else if (targetMode === 'single' && selectedPatientId) {
      success = await sendNotification({ ...baseData, patient_id: selectedPatientId });
    } else if (targetMode === 'bulk' && selectedPatientIds.length > 0) {
      success = await sendBulkNotifications(selectedPatientIds, baseData);
    }

    if (success) {
      // Reset form
      setTitle('');
      setMessage('');
      setType('general');
      setPriority('medium');
      setActionUrl('');
      setScheduleEnabled(false);
      setScheduledDate('');
      setScheduledTime('09:00');
      setSelectedPatientId('');
      setSelectedPatientIds([]);
      setTargetMode('all');
    }
  };

  const getTypeColor = (t: Notification['type']) => {
    const colors: Record<Notification['type'], string> = {
      reminder: 'bg-blue-100 text-blue-800',
      appointment: 'bg-green-100 text-green-800',
      wellness_check: 'bg-purple-100 text-purple-800',
      general: 'bg-gray-100 text-gray-800'
    };
    return colors[t];
  };

  const getPriorityColor = (p: Notification['priority']) => {
    const colors: Record<Notification['priority'], string> = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return colors[p];
  };

  const canSend = () => {
    if (!title.trim() || !message.trim()) return false;
    if (targetMode === 'single' && !selectedPatientId) return false;
    if (targetMode === 'bulk' && selectedPatientIds.length === 0) return false;
    if (scheduleEnabled && !scheduledDate) return false;
    return true;
  };

  const getRecipientCount = () => {
    if (targetMode === 'all') return patients.length;
    if (targetMode === 'single') return 1;
    return selectedPatientIds.length;
  };

  return (
    <Card className="bg-mental-blue">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Send className="h-5 w-5" />
          Send Push Notification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Title & Message */}
        <div>
          <Label className="text-foreground">Title</Label>
          <Input
            placeholder="Notification title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={50}
            className="mt-1"
          />
          <div className="text-xs text-muted-foreground mt-1">{title.length}/50 characters</div>
        </div>

        <div>
          <Label className="text-foreground">Message</Label>
          <Textarea
            placeholder="Notification message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            maxLength={200}
            className="mt-1"
          />
          <div className="text-xs text-muted-foreground mt-1">{message.length}/200 characters</div>
        </div>

        {/* Type & Priority */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-foreground">Type</Label>
            <Select value={type} onValueChange={(v: Notification['type']) => setType(v)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="reminder">Reminder</SelectItem>
                <SelectItem value="appointment">Appointment</SelectItem>
                <SelectItem value="wellness_check">Wellness Check</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-foreground">Priority</Label>
            <Select value={priority} onValueChange={(v: Notification['priority']) => setPriority(v)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Target Audience */}
        <div>
          <Label className="text-foreground">Target Audience</Label>
          <Select value={targetMode} onValueChange={(v: 'all' | 'single' | 'bulk') => setTargetMode(v)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All My Patients ({patients.length})</SelectItem>
              <SelectItem value="single">Specific Patient</SelectItem>
              <SelectItem value="bulk">Select Multiple Patients</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Single Patient Selection */}
        {targetMode === 'single' && (
          <div>
            <Label className="text-foreground">Select Patient</Label>
            {patientsLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground mt-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading patients...
              </div>
            ) : patients.length === 0 ? (
              <p className="text-sm text-muted-foreground mt-2">
                No patients found. Invite patients to get started.
              </p>
            ) : (
              <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose a patient..." />
                </SelectTrigger>
                <SelectContent>
                  {patients.map(patient => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name} ({patient.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}

        {/* Bulk Patient Selection */}
        {targetMode === 'bulk' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-foreground">Select Patients</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={selectAllPatients}
                  disabled={patientsLoading}
                >
                  Select All
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={deselectAllPatients}
                  disabled={patientsLoading}
                >
                  Clear
                </Button>
              </div>
            </div>
            
            {patientsLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading patients...
              </div>
            ) : patients.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No patients found. Invite patients to get started.
              </p>
            ) : (
              <div className="max-h-40 overflow-y-auto space-y-2 p-2 border rounded-md bg-background">
                {patients.map(patient => (
                  <div key={patient.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`patient-${patient.id}`}
                      checked={selectedPatientIds.includes(patient.id)}
                      onCheckedChange={() => handlePatientToggle(patient.id)}
                    />
                    <label
                      htmlFor={`patient-${patient.id}`}
                      className="text-sm cursor-pointer flex-1"
                    >
                      {patient.name} <span className="text-muted-foreground">({patient.email})</span>
                    </label>
                  </div>
                ))}
              </div>
            )}
            
            {selectedPatientIds.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {selectedPatientIds.length} patient(s) selected
              </p>
            )}
          </div>
        )}

        {/* Scheduling */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="schedule"
              checked={scheduleEnabled}
              onCheckedChange={(checked) => setScheduleEnabled(checked as boolean)}
            />
            <label htmlFor="schedule" className="text-sm font-medium cursor-pointer flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Schedule for later
            </label>
          </div>

          {scheduleEnabled && (
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <Label className="text-foreground">Date</Label>
                <Input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-foreground">Time</Label>
                <Input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          )}
        </div>

        {/* Action URL */}
        <div>
          <Label className="text-foreground">Action URL (Optional)</Label>
          <Input
            placeholder="https://... (optional link for notification)"
            value={actionUrl}
            onChange={(e) => setActionUrl(e.target.value)}
            className="mt-1"
          />
        </div>

        {/* Summary Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={getTypeColor(type)}>{type}</Badge>
          <Badge className={getPriorityColor(priority)}>{priority}</Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            {targetMode === 'all' ? <Users className="h-3 w-3" /> : <User className="h-3 w-3" />}
            {getRecipientCount()} recipient(s)
          </Badge>
          {scheduleEnabled && scheduledDate && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Scheduled
            </Badge>
          )}
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={sending || !canSend()}
          className="w-full bg-primary hover:bg-primary/90"
        >
          {sending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              {scheduleEnabled ? 'Schedule Notification' : 'Send Now'}
              {getRecipientCount() > 1 && ` (${getRecipientCount()} recipients)`}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotificationSender;
