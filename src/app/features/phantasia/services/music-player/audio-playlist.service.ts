import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Track } from './audio-handler.service';

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverArt?: string;
  tracks: Track[];
  createdAt: number;
  updatedAt: number;
  isDefault?: boolean;
}

/**
 * Service responsible for managing playlists and track queues
 */
@Injectable({
  providedIn: 'root'
})
export class AudioPlaylistService implements OnDestroy {
  // 【✓】 Service lifecycle management
  private readonly destroy$ = new Subject<void>();
  private readonly isDebugMode = true;
  
  // 【✓】 Playlists management
  private readonly playlistsSubject = new BehaviorSubject<Playlist[]>([]);
  private readonly activePlaylistSubject = new BehaviorSubject<Playlist | null>(null);
  
  // 【✓】 Queue management
  private readonly queueSubject = new BehaviorSubject<Track[]>([]);
  private readonly currentTrackSubject = new BehaviorSubject<Track | null>(null);
  private readonly currentTrackIndexSubject = new BehaviorSubject<number>(-1);
  
  // 【✓】 History management
  private trackHistory: Track[] = [];
  private readonly historySubject = new BehaviorSubject<Track[]>([]);
  
  // 【✓】 Playback modes
  private readonly shuffleModeSubject = new BehaviorSubject<boolean>(false);
  private readonly repeatModeSubject = new BehaviorSubject<'off' | 'all' | 'one'>('off');
  
  constructor() {
    if (this.isDebugMode) {
      console.log('[AudioPlaylistService] Initializing playlist service');
    }
    
    // Initialize with default playlist if needed
    this.initDefaultPlaylist();
  }

  // 【✓】 Initialize with a default playlist if none exists
  private initDefaultPlaylist(): void {
    const defaultPlaylist: Playlist = {
      id: 'default',
      name: 'My Playlist',
      description: 'Default playlist',
      tracks: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isDefault: true
    };
    
    this.playlistsSubject.next([defaultPlaylist]);
    this.activePlaylistSubject.next(defaultPlaylist);
    
    if (this.isDebugMode) {
      console.log('[AudioPlaylistService] Default playlist initialized');
    }
  }

  // 【✓】 Get all playlists
  getPlaylists(): Observable<Playlist[]> {
    return this.playlistsSubject.asObservable();
  }

  // 【✓】 Get active playlist
  getActivePlaylist(): Observable<Playlist | null> {
    return this.activePlaylistSubject.asObservable();
  }

  // 【✓】 Get current queue of tracks
  getQueue(): Observable<Track[]> {
    return this.queueSubject.asObservable();
  }

  // 【✓】 Get the current track
  getCurrentTrack(): Observable<Track | null> {
    return this.currentTrackSubject.asObservable();
  }

  // 【✓】 Get the current track index
  getCurrentTrackIndex(): Observable<number> {
    return this.currentTrackIndexSubject.asObservable();
  }

  // 【✓】 Get track history
  getTrackHistory(): Observable<Track[]> {
    return this.historySubject.asObservable();
  }

  // 【✓】 Get shuffle mode state
  getShuffleMode(): Observable<boolean> {
    return this.shuffleModeSubject.asObservable();
  }

  // 【✓】 Get repeat mode state
  getRepeatMode(): Observable<'off' | 'all' | 'one'> {
    return this.repeatModeSubject.asObservable();
  }

  // 【✓】 Create a new playlist
  createPlaylist(name: string, description?: string, coverArt?: string): Playlist {
    const playlist: Playlist = {
      id: `playlist_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name,
      description,
      coverArt,
      tracks: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    const currentPlaylists = this.playlistsSubject.value;
    this.playlistsSubject.next([...currentPlaylists, playlist]);
    
    if (this.isDebugMode) {
      console.log(`[AudioPlaylistService] Created new playlist: ${name}`);
    }
    
    return playlist;
  }

  // 【✓】 Delete a playlist
  deletePlaylist(playlistId: string): boolean {
    const currentPlaylists = this.playlistsSubject.value;
    const playlistToDelete = currentPlaylists.find(p => p.id === playlistId);
    
    if (!playlistToDelete) {
      if (this.isDebugMode) {
        console.warn(`[AudioPlaylistService] Cannot delete playlist: not found with ID ${playlistId}`);
      }
      return false;
    }
    
    // Check if it's the default playlist
    if (playlistToDelete.isDefault) {
      if (this.isDebugMode) {
        console.warn('[AudioPlaylistService] Cannot delete default playlist');
      }
      return false;
    }
    
    // Remove the playlist
    const updatedPlaylists = currentPlaylists.filter(p => p.id !== playlistId);
    this.playlistsSubject.next(updatedPlaylists);
    
    // If the deleted playlist was active, set the default as active
    if (this.activePlaylistSubject.value?.id === playlistId) {
      const defaultPlaylist = updatedPlaylists.find(p => p.isDefault) || updatedPlaylists[0] || null;
      this.activePlaylistSubject.next(defaultPlaylist);
    }
    
    if (this.isDebugMode) {
      console.log(`[AudioPlaylistService] Deleted playlist: ${playlistToDelete.name}`);
    }
    
    return true;
  }

  // 【✓】 Update a playlist
  updatePlaylist(
    playlistId: string, 
    updates: { name?: string; description?: string; coverArt?: string }
  ): boolean {
    const currentPlaylists = this.playlistsSubject.value;
    const playlistIndex = currentPlaylists.findIndex(p => p.id === playlistId);
    
    if (playlistIndex === -1) {
      if (this.isDebugMode) {
        console.warn(`[AudioPlaylistService] Cannot update playlist: not found with ID ${playlistId}`);
      }
      return false;
    }
    
    const updatedPlaylist = {
      ...currentPlaylists[playlistIndex],
      ...updates,
      updatedAt: Date.now()
    };
    
    const updatedPlaylists = [...currentPlaylists];
    updatedPlaylists[playlistIndex] = updatedPlaylist;
    
    this.playlistsSubject.next(updatedPlaylists);
    
    // If this was the active playlist, update the active playlist too
    if (this.activePlaylistSubject.value?.id === playlistId) {
      this.activePlaylistSubject.next(updatedPlaylist);
    }
    
    if (this.isDebugMode) {
      console.log(`[AudioPlaylistService] Updated playlist: ${updatedPlaylist.name}`);
    }
    
    return true;
  }

  // 【✓】 Set active playlist and update queue
  setActivePlaylist(playlistId: string): boolean {
    const currentPlaylists = this.playlistsSubject.value;
    const playlist = currentPlaylists.find(p => p.id === playlistId);
    
    if (!playlist) {
      if (this.isDebugMode) {
        console.warn(`[AudioPlaylistService] Cannot set active playlist: not found with ID ${playlistId}`);
      }
      return false;
    }
    
    this.activePlaylistSubject.next(playlist);
    
    // Reset the current track and update the queue
    this.resetQueue(playlist.tracks);
    
    if (this.isDebugMode) {
      console.log(`[AudioPlaylistService] Set active playlist: ${playlist.name}`);
    }
    
    return true;
  }

  // 【✓】 Add a track to a playlist
  addTrackToPlaylist(playlistId: string, track: Track): boolean {
    const currentPlaylists = this.playlistsSubject.value;
    const playlistIndex = currentPlaylists.findIndex(p => p.id === playlistId);
    
    if (playlistIndex === -1) {
      if (this.isDebugMode) {
        console.warn(`[AudioPlaylistService] Cannot add track: playlist not found with ID ${playlistId}`);
      }
      return false;
    }
    
    // Check if track already exists
    const trackExists = currentPlaylists[playlistIndex].tracks.some(t => t.id === track.id);
    if (trackExists) {
      if (this.isDebugMode) {
        console.warn(`[AudioPlaylistService] Cannot add track: track already exists in playlist`);
      }
      return false;
    }
    
    // Add track to playlist
    const updatedPlaylist = {
      ...currentPlaylists[playlistIndex],
      tracks: [...currentPlaylists[playlistIndex].tracks, track],
      updatedAt: Date.now()
    };
    
    const updatedPlaylists = [...currentPlaylists];
    updatedPlaylists[playlistIndex] = updatedPlaylist;
    
    this.playlistsSubject.next(updatedPlaylists);
    
    // If this was the active playlist, update the active playlist and queue
    if (this.activePlaylistSubject.value?.id === playlistId) {
      this.activePlaylistSubject.next(updatedPlaylist);
      this.queueSubject.next(this.getQueueBasedOnMode(updatedPlaylist.tracks));
    }
    
    if (this.isDebugMode) {
      console.log(`[AudioPlaylistService] Added track "${track.title}" to playlist "${updatedPlaylist.name}"`);
    }
    
    return true;
  }

  // 【✓】 Remove a track from a playlist
  removeTrackFromPlaylist(playlistId: string, trackId: string): boolean {
    const currentPlaylists = this.playlistsSubject.value;
    const playlistIndex = currentPlaylists.findIndex(p => p.id === playlistId);
    
    if (playlistIndex === -1) {
      if (this.isDebugMode) {
        console.warn(`[AudioPlaylistService] Cannot remove track: playlist not found with ID ${playlistId}`);
      }
      return false;
    }
    
    const currentPlaylist = currentPlaylists[playlistIndex];
    const trackIndex = currentPlaylist.tracks.findIndex(t => t.id === trackId);
    
    if (trackIndex === -1) {
      if (this.isDebugMode) {
        console.warn(`[AudioPlaylistService] Cannot remove track: track not found in playlist`);
      }
      return false;
    }
    
    const updatedTracks = [...currentPlaylist.tracks];
    updatedTracks.splice(trackIndex, 1);
    
    const updatedPlaylist = {
      ...currentPlaylist,
      tracks: updatedTracks,
      updatedAt: Date.now()
    };
    
    const updatedPlaylists = [...currentPlaylists];
    updatedPlaylists[playlistIndex] = updatedPlaylist;
    
    this.playlistsSubject.next(updatedPlaylists);
    
    // If this was the active playlist, update the active playlist and queue
    if (this.activePlaylistSubject.value?.id === playlistId) {
      this.activePlaylistSubject.next(updatedPlaylist);
      
      // If we're removing the current track, play the next track
      if (this.currentTrackSubject.value?.id === trackId) {
        const currentIndex = this.currentTrackIndexSubject.value;
        
        // If there are tracks left, play the next one
        if (updatedTracks.length > 0) {
          const nextIndex = currentIndex >= updatedTracks.length ? 0 : currentIndex;
          this.setCurrentTrackIndex(nextIndex);
        } else {
          // No tracks left, reset the player
          this.resetPlayer();
        }
      } else {
        // Just update the queue
        this.queueSubject.next(this.getQueueBasedOnMode(updatedTracks));
        
        // Adjust the current track index if needed
        if (trackIndex < this.currentTrackIndexSubject.value) {
          this.currentTrackIndexSubject.next(this.currentTrackIndexSubject.value - 1);
        }
      }
    }
    
    if (this.isDebugMode) {
      console.log(`[AudioPlaylistService] Removed track from playlist "${updatedPlaylist.name}"`);
    }
    
    return true;
  }

  // 【✓】 Play a specific track from the queue
  playTrack(trackId: string): boolean {
    const queue = this.queueSubject.value;
    const trackIndex = queue.findIndex(track => track.id === trackId);
    
    if (trackIndex === -1) {
      if (this.isDebugMode) {
        console.warn(`[AudioPlaylistService] Cannot play track: not found in queue with ID ${trackId}`);
      }
      return false;
    }
    
    this.setCurrentTrackIndex(trackIndex);
    return true;
  }

  // 【✓】 Play next track
  playNextTrack(): boolean {
    const queue = this.queueSubject.value;
    if (queue.length === 0) {
      if (this.isDebugMode) {
        console.warn('[AudioPlaylistService] Cannot play next track: queue is empty');
      }
      return false;
    }
    
    const currentIndex = this.currentTrackIndexSubject.value;
    const repeatMode = this.repeatModeSubject.value;
    
    // Handle repeat one mode
    if (repeatMode === 'one') {
      // Just replay the current track
      this.setCurrentTrackIndex(currentIndex);
      return true;
    }
    
    // Handle end of queue
    if (currentIndex === queue.length - 1) {
      if (repeatMode === 'all') {
        // Loop back to the first track
        this.setCurrentTrackIndex(0);
        return true;
      } else {
        // End of playlist reached
        if (this.isDebugMode) {
          console.log('[AudioPlaylistService] End of playlist reached');
        }
        return false;
      }
    }
    
    // Normal case - play next track
    this.setCurrentTrackIndex(currentIndex + 1);
    return true;
  }

  // 【✓】 Play previous track
  playPreviousTrack(): boolean {
    const queue = this.queueSubject.value;
    if (queue.length === 0) {
      if (this.isDebugMode) {
        console.warn('[AudioPlaylistService] Cannot play previous track: queue is empty');
      }
      return false;
    }
    
    const currentIndex = this.currentTrackIndexSubject.value;
    
    // If we're at the beginning of the queue
    if (currentIndex <= 0) {
      if (this.repeatModeSubject.value === 'all') {
        // Loop to the last track
        this.setCurrentTrackIndex(queue.length - 1);
        return true;
      } else {
        // Stay at the first track
        this.setCurrentTrackIndex(0);
        return false;
      }
    }
    
    // Normal case - play previous track
    this.setCurrentTrackIndex(currentIndex - 1);
    return true;
  }

  // 【✓】 Play first track in queue
  playFirstTrack(): boolean {
    const queue = this.queueSubject.value;
    if (queue.length === 0) {
      if (this.isDebugMode) {
        console.warn('[AudioPlaylistService] Cannot play first track: queue is empty');
      }
      return false;
    }
    
    this.setCurrentTrackIndex(0);
    return true;
  }

  // 【✓】 Toggle shuffle mode
  toggleShuffleMode(): boolean {
    const newShuffleMode = !this.shuffleModeSubject.value;
    this.shuffleModeSubject.next(newShuffleMode);
    
    // Re-build the queue with the new shuffle setting
    if (this.activePlaylistSubject.value) {
      const currentTracks = this.activePlaylistSubject.value.tracks;
      const newQueue = this.getQueueBasedOnMode(currentTracks);
      this.queueSubject.next(newQueue);
      
      // Adjust the current track index
      if (this.currentTrackSubject.value) {
        const currentTrackId = this.currentTrackSubject.value.id;
        const newIndex = newQueue.findIndex(t => t.id === currentTrackId);
        if (newIndex !== -1) {
          this.currentTrackIndexSubject.next(newIndex);
        }
      }
    }
    
    if (this.isDebugMode) {
      console.log(`[AudioPlaylistService] Shuffle mode ${newShuffleMode ? 'enabled' : 'disabled'}`);
    }
    
    return newShuffleMode;
  }

  // 【✓】 Cycle through repeat modes: off -> all -> one -> off
  cycleRepeatMode(): string {
    const currentMode = this.repeatModeSubject.value;
    let newMode: 'off' | 'all' | 'one';
    
    switch (currentMode) {
      case 'off':
        newMode = 'all';
        break;
      case 'all':
        newMode = 'one';
        break;
      case 'one':
      default:
        newMode = 'off';
        break;
    }
    
    this.repeatModeSubject.next(newMode);
    
    if (this.isDebugMode) {
      console.log(`[AudioPlaylistService] Repeat mode set to: ${newMode}`);
    }
    
    return newMode;
  }

  // 【✓】 Set repeat mode directly
  setRepeatMode(mode: 'off' | 'all' | 'one'): void {
    this.repeatModeSubject.next(mode);
    
    if (this.isDebugMode) {
      console.log(`[AudioPlaylistService] Repeat mode set to: ${mode}`);
    }
  }

  // 【✓】 Clear all playlists (except default)
  clearPlaylists(): void {
    const defaultPlaylist = this.playlistsSubject.value.find(p => p.isDefault);
    
    if (defaultPlaylist) {
      this.playlistsSubject.next([defaultPlaylist]);
      this.activePlaylistSubject.next(defaultPlaylist);
      this.resetQueue(defaultPlaylist.tracks);
    } else {
      this.initDefaultPlaylist();
    }
    
    if (this.isDebugMode) {
      console.log('[AudioPlaylistService] All playlists cleared');
    }
  }

  // 【✓】 Helper methods
  
  // Reset the queue with new tracks
  private resetQueue(tracks: Track[]): void {
    const queue = this.getQueueBasedOnMode(tracks);
    this.queueSubject.next(queue);
    this.resetPlayer();
    
    if (this.isDebugMode) {
      console.log(`[AudioPlaylistService] Queue reset with ${tracks.length} tracks`);
    }
  }
  
  // Reset the player state
  private resetPlayer(): void {
    this.currentTrackSubject.next(null);
    this.currentTrackIndexSubject.next(-1);
    this.trackHistory = [];
    this.historySubject.next([]);
    
    if (this.isDebugMode) {
      console.log('[AudioPlaylistService] Player reset');
    }
  }
  
  // Set the current track by index
  private setCurrentTrackIndex(index: number): void {
    const queue = this.queueSubject.value;
    
    if (index >= 0 && index < queue.length) {
      const previousTrack = this.currentTrackSubject.value;
      const newTrack = queue[index];
      
      // Add previous track to history if it exists
      if (previousTrack) {
        this.trackHistory.push(previousTrack);
        this.historySubject.next([...this.trackHistory]);
      }
      
      this.currentTrackSubject.next(newTrack);
      this.currentTrackIndexSubject.next(index);
      
      if (this.isDebugMode) {
        console.log(`[AudioPlaylistService] Current track set to: ${newTrack.title} (index: ${index})`);
      }
    }
  }
  
  // Get queue based on shuffle mode
  private getQueueBasedOnMode(tracks: Track[]): Track[] {
    if (!tracks || tracks.length === 0) {
      return [];
    }
    
    if (this.shuffleModeSubject.value) {
      return this.shuffleTracks([...tracks]);
    }
    
    return [...tracks];
  }
  
  // Fisher-Yates shuffle algorithm
  private shuffleTracks(tracks: Track[]): Track[] {
    for (let i = tracks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
    }
    return tracks;
  }

  // 【✓】 Cleanup resources
  ngOnDestroy(): void {
    if (this.isDebugMode) {
      console.log('[AudioPlaylistService] Destroying service');
    }
    
    // Complete all subjects
    this.playlistsSubject.complete();
    this.activePlaylistSubject.complete();
    this.queueSubject.complete();
    this.currentTrackSubject.complete();
    this.currentTrackIndexSubject.complete();
    this.historySubject.complete();
    this.shuffleModeSubject.complete();
    this.repeatModeSubject.complete();
    
    // Signal completion to any active subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }
} 