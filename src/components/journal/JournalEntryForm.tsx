// @ts-nocheck
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Save, Tag, Trash2, Mic, MicOff } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { JournalEntry, Category } from '@/lib/types';
import { CATEGORIES, DEFAULT_CATEGORY } from '@/lib/constants';
import { useAppStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import React, { useState, useEffect, useRef } from 'react';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  content: z.string().min(10, 'Content should be at least 10 characters long'),
  date: z.date({ required_error: 'Date is required.' }),
  category: z.enum(CATEGORIES as [Category, ...Category[]], { required_error: 'Category is required.' }),
  tags: z.string().optional(), // Comma-separated tags
});

type JournalFormValues = z.infer<typeof formSchema>;

interface JournalEntryFormProps {
  entry?: JournalEntry;
  onSave?: () => void;
}

export default function JournalEntryForm({ entry, onSave }: JournalEntryFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { addJournalEntry, updateJournalEntry } = useAppStore();
  const [currentTags, setCurrentTags] = useState<string[]>(entry?.tags || []);

  const [isListening, setIsListening] = useState(false);
  const [isSpeechApiSupported, setIsSpeechApiSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const form = useForm<JournalFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: entry?.title || '',
      content: entry?.content || '',
      date: entry ? new Date(entry.date) : new Date(),
      category: entry?.category || DEFAULT_CATEGORY,
      tags: entry?.tags?.join(', ') || '',
    },
  });

  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      setIsSpeechApiSupported(true);
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        toast({ title: 'Listening...', description: 'Speak into your microphone.' });
      };

      recognition.onend = () => {
        setIsListening(false);
        // toast({ title: 'Stopped listening.' }); // Can be noisy if it stops often
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        let errorMessage = 'An unknown error occurred during speech recognition.';
        if (event.error === 'no-speech') {
          errorMessage = 'No speech was detected. Please try again.';
        } else if (event.error === 'audio-capture') {
          errorMessage = 'Microphone problem. Ensure it is connected and enabled.';
        } else if (event.error === 'not-allowed') {
          errorMessage = 'Microphone access denied. Please enable it in browser settings.';
        }
        toast({ variant: 'destructive', title: 'Speech Error', description: errorMessage });
        setIsListening(false);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscriptSegment = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscriptSegment += transcriptPart;
          }
        }

        if (finalTranscriptSegment.trim()) {
          const currentContent = form.getValues('content');
          form.setValue('content', (currentContent ? currentContent + ' ' : '') + finalTranscriptSegment.trim() + ' ', { shouldValidate: true, shouldDirty: true });
        }
      };
      recognitionRef.current = recognition;
    } else {
      setIsSpeechApiSupported(false);
      toast({ variant: 'destructive', title: 'Unsupported Browser', description: 'Speech recognition is not supported in your browser.' });
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [toast, form]);

  const handleToggleListening = async () => {
    if (!isSpeechApiSupported || !recognitionRef.current) {
      toast({ variant: 'destructive', title: 'Speech Not Supported', description: 'Your browser does not support speech recognition.' });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        // Check for microphone permission (getUserMedia also implicitly requests if not granted)
        await navigator.mediaDevices.getUserMedia({ audio: true });
        recognitionRef.current.start();
      } catch (err) {
        console.error('Error accessing microphone:', err);
        toast({
          variant: 'destructive',
          title: 'Microphone Access Denied',
          description: 'Please enable microphone permissions in your browser settings.',
        });
      }
    }
  };


  function onSubmit(data: JournalFormValues) {
    const tagsArray = data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '') : [];
    
    if (entry) {
      updateJournalEntry({ ...entry, ...data, tags: tagsArray, date: data.date.toISOString() });
      toast({ title: 'Success', description: 'Journal entry updated.' });
    } else {
      addJournalEntry({ ...data, tags: tagsArray, date: data.date });
      toast({ title: 'Success', description: 'Journal entry saved.' });
    }
    form.reset({
      title: '',
      content: '',
      date: new Date(),
      category: DEFAULT_CATEGORY,
      tags: '',
    });
    setCurrentTags([]);
    if (onSave) {
      onSave();
    } else {
      router.push('/journal');
    }
  }

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue('tags', e.target.value);
    const inputTags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    setCurrentTags(inputTags);
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = currentTags.filter(tag => tag !== tagToRemove);
    setCurrentTags(newTags);
    form.setValue('tags', newTags.join(', '));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="My amazing day" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <div className="relative">
                  <Textarea
                    placeholder="Tell me about your day... (Markdown supported)"
                    className="min-h-[200px] resize-y pr-12" // Add padding for the button
                    {...field}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant={isListening ? "destructive" : "outline"}
                    className="absolute bottom-3 right-3 rounded-full h-9 w-9 shadow-md"
                    onClick={handleToggleListening}
                    disabled={!isSpeechApiSupported}
                    title={isListening ? 'Stop recording' : 'Start recording with microphone'}
                  >
                    {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    <span className="sr-only">{isListening ? 'Stop recording' : 'Start recording'}</span>
                  </Button>
                </div>
              </FormControl>
              <FormDescription>
                You can use Markdown for formatting.
                {isSpeechApiSupported && isListening && <span className="ml-2 text-primary animate-pulse">Listening...</span>}
                 {!isSpeechApiSupported && <span className="ml-2 text-muted-foreground">(Speech-to-text not available)</span>}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input placeholder="e.g., work, project, happy" {...field} onChange={handleTagInputChange} />
              </FormControl>
              <FormDescription>
                Comma-separated tags.
              </FormDescription>
              <div className="mt-2 flex flex-wrap gap-2">
                {currentTags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm">
                    <Tag className="h-3 w-3" />
                    {tag}
                    <Button variant="ghost" size="icon" className="h-5 w-5 ml-1" onClick={() => removeTag(tag)}>
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </span>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full md:w-auto">
          <Save className="mr-2 h-4 w-4" />
          {entry ? 'Update Entry' : 'Save Entry'}
        </Button>
      </form>
    </Form>
  );
}
