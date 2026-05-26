# MK Translator Project

## Overview

MK Translator is an offline-capable Mongolian ↔ Korean translation web application designed for real-time communication in remote environments with limited or no internet access.

The application focuses on simplicity, readability, and low-friction communication through subtitle-style translation.

---

# Current Status
* Basic UI
* Demo text display
* Animations


# Core Goals

## Translation Directions

* Mongolian → Korean
* Korean → Mongolian

## Input Methods

* Voice input (speech-to-text)
* Typed text input

## Output Method

* Large subtitle-style translated text
* Fast readability during live conversation

## Performance Targets

* Maximum delay target: 3–5 seconds
* Responsive UI even during AI processing
* Graceful handling of slower devices

## Platform Targets

* Web browser support
* Progressive Web App (PWA)
* Offline-capable after initial setup

---

# Functional Pipeline

## Voice Translation Flow

Microphone Input
→ Audio Chunking
→ Speech-to-Text (Whisper)
→ Translation Model (NLLB)
→ Subtitle Output

## Text Translation Flow

Typed Text
→ Translation Model (NLLB)
→ Subtitle Output

---

# AI Architecture

## Speech-to-Text

Model:

* Whisper Tiny or Whisper Base

Responsibilities:

* Mongolian speech recognition
* Korean speech recognition
* Offline inference
* Chunk-based transcription

## Translation

Model:

* Quantized NLLB translation model

Responsibilities:

* Context-aware sentence translation
* Mongolian ↔ Korean translation
* Offline translation inference

---

# Audio Processing Strategy

## Chunking

* Audio processed in chunks
* Approximate chunk length: 3–5 seconds

## Smart Splitting

Avoid cutting mid-word by using:

* Silence detection
* Voice activity detection
* Slight overlap between chunks

## Latency Handling

UI should immediately show:

* Listening state
* Processing state
* Translation state

The app should never appear frozen or idle.

---

# UI/UX Goals

## Visual Style

* Minimal
* Bright
* Clean
* High readability
* Calm and professional

## Interaction Design

A user should understand how to use the app without instructions.

The interface should rely on:

* Clear icons
* Obvious buttons
* Immediate visual feedback
* Large readable subtitles

## Responsiveness

* UI animations should remain smooth
* Translation lag must not freeze the interface
* Show active processing indicators when AI inference is running

---

# Future Goals (Optional)

* Speaker differentiation
* Conversation history
* Downloadable offline language packs
* Device-to-device local networking
* Better mobile optimization
* Native app packaging

---

# MVP Priorities

## Phase 1

* Browser UI
* Microphone access
* Audio chunk recording

## Phase 2

* Whisper speech-to-text integration

## Phase 3

* NLLB translation integration

## Phase 4

* Mobile optimization
* PWA conversion
* Offline caching

---

# Design Philosophy

The application should feel:

* Calm
* Immediate
* Reliable
* Understandable under stress
* Functional even in remote environments
