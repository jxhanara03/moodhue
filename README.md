# MoodHue: A Color Palette Generator Based on Mood & Description

MoodHue is a mood-based color palette generator built with **React** and **Firebase**. Users can select a mood via emoji or type in a description to receive color palette recommendations powered by **The Color API**. Users can log in to save favorite palettes and revisit them anytime.

---

## 🌟 Project Overview

MoodHue helps users discover color inspiration based on emotions. It supports creativity and self-expression while providing a fun and personalized experience for artists, designers, or anyone curious about color.

---

## 🚀 Technologies Used

- **React** (Vite + JSX)  
- **React Router DOM**  
- **Tailwind CSS**  
- **Firebase Auth & Firestore**  
- **The Color API** (for generating palettes)

---

## 🛠️ Setup & Installation Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/jxhanara03/moodhue.git
   cd moodhue
   ````

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Firebase Setup**

   * Create a Firebase project
   * Enable **Email/Password Authentication**
   * Create a **Firestore database**
   * Add your Firebase config to `firebase.js`

4. **Run the App**

   ```bash
   npm run dev
   ```

---

## 💡 Usage Guidelines

### 🏠 Home Page

* Select an emoji that reflects your mood **OR** type in a custom description
* Click the "Generate Palette" button to see palettes matching that vibe

### 🎨 Palette Results Page

* View mood-based color combinations
* Click the heart 🩷 icon to save favorites (requires login)

### 💾 Saved Palettes Page

* View all previously saved palettes
* Unsave any palette using the heart toggle

### 🔐 Authentication

* Log in or sign up to save your palettes
* If not logged in, clicking the heart icon will redirect to the login or sign-up page

---

## 🌐 API Documentation

We use **The Color API** to fetch palette data.

**Endpoint format:**

```
GET https://www.thecolorapi.com/scheme?hex={hex}&mode={mode}&count=5
```

* `hex`: Base hex code (based on mood or keyword)
* `mode`: One of: `analogic`, `monochrome`, `triad`, `quad`, `complement`, `analogic-complement`
* `count`: Always set to `5`

---

## 🧠 Known Issues & Future Enhancements

* 🔄 **Better NLP for typed descriptions**
  Improve keyword detection and mapping using NLP services

* 🧾 **User profile page**
  Let users rename saved palettes and manage their account

* 💾 **Export options**
  Let users download or copy palette codes easily

---

## 📁 Repository & Live Demo

* **GitHub Repository**: [https://github.com/jxhanara03/moodhue](https://github.com/jxhanara03/moodhue)
* **Live Demo** (Netlify): [https://precious-bombolone-607a12.netlify.app/](https://precious-bombolone-607a12.netlify.app/)

---

## 📝 Project Proposals

* [📄 FP1 Proposal](https://docs.google.com/document/d/1mbgR8WZZNJ36T1__GVI3xSQ6jLz0TQCD69oAd51niak/edit?usp=sharing)
* [📄 FP2 Progress Report](https://docs.google.com/document/d/1J_zTsuO7yScKmAn0E_mPEOwE7y_QjnaVvNwQn8rqN8I/edit?usp=sharing)

---

## 👩‍🎨 Made with 🩷 by \[Hanara Nam]