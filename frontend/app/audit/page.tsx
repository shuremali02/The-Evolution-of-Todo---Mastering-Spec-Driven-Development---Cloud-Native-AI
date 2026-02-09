"use client";

'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  ClockIcon,
  CalendarIcon,
  CheckCircleIcon,
  PlusCircleIcon,
  EditIcon,
  TrashIcon,
  RefreshCw
} from 'lucide-react';
import { auditService } from '@/lib/audit-service';

interface AuditEvent {
  event_id: string;
  event_type: 'created' | 'updated' | 'completed' | 'deleted';
  task_id: number;
  event_data: {
    title: string;
    description: string;
    completed: boolean;
  };
  timestamp: string;
}

export default function AuditTrailPage() {
  const { user, isLoaded } = useUser();
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | AuditEvent['event_type']>('all');

  // Get user ID from Clerk
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;

    fetchAuditTrail();
  }, [userId]);

  const fetchAuditTrail = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      const data = await auditService.getAuditTrail(userId);
      setAuditEvents(data.events || []);
    } catch (err) {
      console.error('Error fetching audit trail:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch audit trail');
    } finally {
      setLoading(false);
    }
  };

  // Filter events based on selection
  const filteredEvents = filter === 'all'
    ? auditEvents
    : auditEvents.filter(event => event.event_type === filter);

  // Get badge variant based on event type
  const getEventBadgeVariant = (eventType: AuditEvent['event_type']) => {
    switch (eventType) {
      case 'created':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'updated':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'deleted':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get icon based on event type
  const getEventIcon = (eventType: AuditEvent['event_type']) => {
    switch (eventType) {
      case 'created':
        return <PlusCircleIcon className="h-4 w-4 text-green-600" />;
      case 'updated':
        return <EditIcon className="h-4 w-4 text-blue-600" />;
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4 text-purple-600" />;
      case 'deleted':
        return <TrashIcon className="h-4 w-4 text-red-600" />;
      default:
        return <ClockIcon className="h-4 w-4 text-gray-600" />;
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (!isLoaded) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Skeleton className="h-10 w-64 mb-6" />
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert>
          <AlertDescription>
            Please sign in to view your audit trail.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Audit Trail</h1>
        <p className="text-muted-foreground mt-2">
          View the complete history of all actions performed on your tasks
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filter === 'all' ? 'secondary' : 'outline'}
            onClick={() => setFilter('all')}
            size="sm"
          >
            All Events
          </Button>
          <Button
            variant={filter === 'created' ? 'secondary' : 'outline'}
            onClick={() => setFilter('created')}
            size="sm"
          >
            <PlusCircleIcon className="h-4 w-4 mr-2" />
            Created
          </Button>
          <Button
            variant={filter === 'updated' ? 'secondary' : 'outline'}
            onClick={() => setFilter('updated')}
            size="sm"
          >
            <EditIcon className="h-4 w-4 mr-2" />
            Updated
          </Button>
          <Button
            variant={filter === 'completed' ? 'secondary' : 'outline'}
            onClick={() => setFilter('completed')}
            size="sm"
          >
            <CheckCircleIcon className="h-4 w-4 mr-2" />
            Completed
          </Button>
          <Button
            variant={filter === 'deleted' ? 'secondary' : 'outline'}
            onClick={() => setFilter('deleted')}
            size="sm"
          >
            <TrashIcon className="h-4 w-4 mr-2" />
            Deleted
          </Button>
        </div>

        <Button
          variant="outline"
          onClick={fetchAuditTrail}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {filteredEvents.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <ClockIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No audit events found</h3>
            <p className="text-muted-foreground">
              {filter === 'all'
                ? "No task operations have been recorded yet."
                : `No ${filter} events found.`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <Card key={event.event_id}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="mt-1">
                    {getEventIcon(event.event_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate">
                        {event.event_data.title}
                      </h3>
                      <Badge className={`${getEventBadgeVariant(event.event_type)} ml-2`}>
                        {event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mt-1">
                      Task ID: {event.task_id}
                    </p>

                    {event.event_data.description && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {event.event_data.description}
                      </p>
                    )}

                    <div className="flex items-center text-xs text-muted-foreground mt-3">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      <span>{formatDate(event.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {loading && auditEvents.length === 0 && !error && (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}