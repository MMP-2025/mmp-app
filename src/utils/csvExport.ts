
export interface ExportableData {
  id: string;
  timestamp: number;
  date: string;
  [key: string]: any;
}

export class CSVExporter {
  static exportMoodData(moodEntries: any[]) {
    const headers = ['Date', 'Time', 'Mood', 'Intensity', 'Factors', 'Note', 'Sleep Hours', 'Exercise'];
    const csvContent = this.generateCSV(moodEntries, headers, (entry) => [
      entry.date,
      new Date(entry.timestamp).toLocaleTimeString(),
      entry.mood,
      entry.intensity,
      entry.factors.join('; '),
      entry.note || '',
      entry.sleepHours || '',
      entry.exercise ? 'Yes' : 'No'
    ]);
    
    this.downloadCSV(csvContent, 'mood-data');
  }

  static exportJournalData(journalEntries: any[]) {
    const headers = ['Date', 'Time', 'Title', 'Content', 'Word Count', 'Mood', 'Tags'];
    const csvContent = this.generateCSV(journalEntries, headers, (entry) => [
      entry.date,
      new Date(entry.timestamp).toLocaleTimeString(),
      entry.title || '',
      entry.content,
      entry.content.split(' ').length.toString(),
      entry.mood || '',
      entry.tags?.join('; ') || ''
    ]);
    
    this.downloadCSV(csvContent, 'journal-data');
  }

  static exportGratitudeData(gratitudeEntries: any[]) {
    const headers = ['Date', 'Time', 'Entry 1', 'Entry 2', 'Entry 3', 'Note'];
    const csvContent = this.generateCSV(gratitudeEntries, headers, (entry) => [
      entry.date,
      new Date(entry.timestamp).toLocaleTimeString(),
      entry.items?.[0] || '',
      entry.items?.[1] || '',
      entry.items?.[2] || '',
      entry.note || ''
    ]);
    
    this.downloadCSV(csvContent, 'gratitude-data');
  }

  static exportMindfulnessData(mindfulnessEntries: any[]) {
    const headers = ['Date', 'Time', 'Exercise', 'Duration', 'Rating', 'Note'];
    const csvContent = this.generateCSV(mindfulnessEntries, headers, (entry) => [
      entry.date,
      new Date(entry.timestamp).toLocaleTimeString(),
      entry.exerciseTitle,
      entry.duration?.toString() || '',
      entry.rating?.toString() || '',
      entry.note || ''
    ]);
    
    this.downloadCSV(csvContent, 'mindfulness-data');
  }

  private static generateCSV<T>(
    data: T[], 
    headers: string[], 
    rowMapper: (item: T) => string[]
  ): string {
    const csvRows = [headers];
    
    data.forEach(item => {
      const row = rowMapper(item).map(field => 
        `"${String(field).replace(/"/g, '""')}"`
      );
      csvRows.push(row);
    });
    
    return csvRows.map(row => row.join(',')).join('\n');
  }

  private static downloadCSV(csvContent: string, filename: string): void {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
