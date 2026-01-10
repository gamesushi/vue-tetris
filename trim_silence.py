import wave
import struct
import os

def trim_silence(filepath, threshold=500):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return

    print(f"Processing {filepath}...")
    
    try:
        with wave.open(filepath, 'rb') as wav:
            params = wav.getparams()
            nchannels, sampwidth, framerate, nframes, comptype, compname = params
            frames = wav.readframes(nframes)
            
        print(f"Original frames: {nframes}")
        
        # Assume 16-bit audio (2 bytes per sample)
        if sampwidth != 2:
            print(f"Skipping {filepath}: Only 16-bit audio supported.")
            return

        # Convert to samples
        fmt = f"<{len(frames) // 2}h"
        samples = struct.unpack(fmt, frames)
        
        start_index = 0
        for i in range(0, len(samples), nchannels):
            # Check all channels in the frame
            is_silent = True
            for c in range(nchannels):
                if abs(samples[i+c]) > threshold:
                    is_silent = False
                    break
            
            if not is_silent:
                start_index = i
                break
                
        if start_index > 0:
            print(f"Found silence: Trimming {start_index} samples ({start_index / framerate:.4f}s)")
            trimmed_samples = samples[start_index:]
            trimmed_frames = struct.pack(f"<{len(trimmed_samples)}h", *trimmed_samples)
            
            with wave.open(filepath, 'wb') as wav:
                wav.setparams(params)
                wav.writeframes(trimmed_frames)
            print("Trimmed successfully.")
        else:
            print("No silence found at start.")
            
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

if __name__ == "__main__":
    base_dir = r"d:\dev\games\vue-tetris\src\assets\sound"
    trim_silence(os.path.join(base_dir, "move.wav"))
    trim_silence(os.path.join(base_dir, "rotate.wav"))
    trim_silence(os.path.join(base_dir, "fall.wav"))
    trim_silence(os.path.join(base_dir, "clear.wav"))
