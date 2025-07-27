# API Reference

## 🔌 API Integration Overview

The OpenDoorPH website currently operates as a static website with minimal external API integrations. This document outlines current integrations and potential future API implementations.

## 📡 Current External Integrations

### 🔵 Facebook Integration

#### Facebook Page Videos
**Type**: Direct Link Integration  
**Purpose**: Connect users to church Facebook video content  
**Implementation**: Static link in SideBar component

#### Integration Details
```javascript
// Current implementation in SideBar.js
<a href="https://www.facebook.com/pg/Open-Door-Full-Gospel-Of-Pleasant-Hill-MO-217411360471/videos">
    Facebook Video
</a>
```

#### API Information
- **URL**: `https://www.facebook.com/pg/Open-Door-Full-Gospel-Of-Pleasant-Hill-MO-217411360471/videos`
- **Type**: Static link (no API calls)
- **Purpose**: Direct users to church Facebook video content
- **Authentication**: None required (public content)

---

## 🌐 Browser APIs

### 📱 Web APIs Currently Used

#### React Router DOM
**Purpose**: Client-side routing and navigation  
**Version**: 4.2.2

```javascript
// Router implementation in Master.js
import { BrowserRouter as Router, Route } from "react-router-dom";

<Router>
    <div>
        <Route exact={true} path="/" render={Main}/>
        <Route exact={true} path="/opendoor" render={Main}/>
        <Route exact={true} path="/opendoor/Home/Video" render={Video}/>
        <Route exact={true} path="/opendoor/Home/Location" render={Location}/>
        <Route exact={true} path="/opendoor/Home/About" render={About}/>
    </div>
</Router>
```

#### Browser History API
**Purpose**: Navigation state management  
**Usage**: Integrated through React Router  
**Features**: 
- Back/forward button support
- URL state preservation
- Bookmarkable URLs

---

## 🚀 Potential Future API Integrations

### 📧 Email and Communication APIs

#### SendGrid API
**Purpose**: Contact form and newsletter functionality  
**Use Case**: Visitor inquiries and community newsletter

```javascript
// Potential implementation
const sendContactForm = async (formData) => {
    const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });
    return response.json();
};
```

#### Mailchimp API
**Purpose**: Newsletter subscription management  
**Use Case**: Community newsletter and announcements

```javascript
// Potential newsletter subscription
const subscribeToNewsletter = async (email) => {
    const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });
    return response.json();
};
```

### 📅 Calendar and Events APIs

#### Google Calendar API
**Purpose**: Church events and service schedule display  
**Use Case**: Dynamic event calendar on website

```javascript
// Potential Google Calendar integration
const getChurchEvents = async () => {
    const response = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/PRIMARY/events',
        {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        }
    );
    return response.json();
};
```

#### Eventbrite API
**Purpose**: Event registration and management  
**Use Case**: VBS registration, special events

```javascript
// Potential event registration
const registerForEvent = async (eventId, attendeeData) => {
    const response = await fetch(`/api/events/${eventId}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attendeeData)
    });
    return response.json();
};
```

### 📱 Social Media APIs

#### Facebook Graph API
**Purpose**: Dynamic Facebook content integration  
**Use Case**: Embed recent posts and videos

```javascript
// Potential Facebook content fetching
const getFacebookPosts = async () => {
    const response = await fetch(
        `https://graph.facebook.com/v12.0/${pageId}/posts?access_token=${accessToken}`
    );
    return response.json();
};
```

#### YouTube API
**Purpose**: Sermon and service video management  
**Use Case**: Dynamic video content display

```javascript
// Potential YouTube integration
const getChurchVideos = async () => {
    const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet&order=date`
    );
    return response.json();
};
```

### 💰 Payment and Donation APIs

#### Stripe API
**Purpose**: Online donation processing  
**Use Case**: Secure online giving platform

```javascript
// Potential donation processing
const processDonation = async (donationData) => {
    const response = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donationData)
    });
    return response.json();
};
```

#### PayPal API
**Purpose**: Alternative payment processing  
**Use Case**: PayPal-based donations

```javascript
// Potential PayPal integration
const createPayPalOrder = async (amount) => {
    const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
    });
    return response.json();
};
```

### 🗺️ Location and Mapping APIs

#### Google Maps API
**Purpose**: Interactive church location display  
**Use Case**: Enhanced location page with directions

```javascript
// Potential Google Maps integration
const initializeMap = () => {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: CHURCH_LAT, lng: CHURCH_LNG },
        zoom: 15
    });
    
    new google.maps.Marker({
        position: { lat: CHURCH_LAT, lng: CHURCH_LNG },
        map: map,
        title: 'Open Door Full Gospel Church'
    });
};
```

### 📊 Analytics and Monitoring APIs

#### Google Analytics API
**Purpose**: Website traffic and user behavior analysis  
**Implementation**: Currently available for integration

```javascript
// Google Analytics 4 integration
gtag('config', 'GA_MEASUREMENT_ID', {
    page_title: document.title,
    page_location: window.location.href
});
```

#### Hotjar API
**Purpose**: User experience and heatmap analysis  
**Use Case**: Understand user interaction patterns

---

## 🔒 API Security Considerations

### Authentication Methods

#### API Key Management
```javascript
// Environment variable usage
const API_KEY = process.env.REACT_APP_API_KEY;

// Secure API calls
const secureApiCall = async (endpoint) => {
    const response = await fetch(endpoint, {
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        }
    });
    return response.json();
};
```

#### OAuth 2.0 Implementation
```javascript
// OAuth flow for social media APIs
const initiateOAuth = () => {
    const authUrl = `https://oauth-provider.com/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    window.location.href = authUrl;
};
```

### Data Protection
- **HTTPS Only**: All API calls over encrypted connections
- **Input Validation**: Sanitize all user inputs
- **Rate Limiting**: Implement API call limits
- **Error Handling**: Secure error messages without data exposure

---

## 📁 API Response Formats

### Standard Response Structure
```javascript
// Success response format
{
    "success": true,
    "data": {
        // response data
    },
    "message": "Operation completed successfully"
}

// Error response format
{
    "success": false,
    "error": {
        "code": "ERROR_CODE",
        "message": "User-friendly error message"
    }
}
```

### Common Data Types
```javascript
// Event data structure
{
    "id": "event-123",
    "title": "Sunday Morning Service",
    "description": "Weekly worship service",
    "startTime": "2024-01-07T10:15:00Z",
    "endTime": "2024-01-07T11:30:00Z",
    "location": "Open Door Full Gospel Church"
}

// Contact form data
{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1-555-123-4567",
    "message": "Inquiry about church services",
    "timestamp": "2024-01-01T12:00:00Z"
}
```

---

## 🛠️ API Integration Guidelines

### Implementation Best Practices

#### Error Handling
```javascript
const apiCall = async (endpoint) => {
    try {
        const response = await fetch(endpoint);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        // Handle error appropriately
        return { success: false, error: error.message };
    }
};
```

#### Loading States
```javascript
const [loading, setLoading] = useState(false);
const [data, setData] = useState(null);
const [error, setError] = useState(null);

const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
        const result = await apiCall('/api/endpoint');
        setData(result.data);
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
};
```

#### Caching Strategy
```javascript
// Simple cache implementation
const cache = new Map();

const cachedApiCall = async (endpoint, cacheTime = 5 * 60 * 1000) => {
    const cacheKey = endpoint;
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < cacheTime) {
        return cached.data;
    }
    
    const data = await apiCall(endpoint);
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
};
```

---

## 📚 Documentation and Testing

### API Documentation Tools
- **Swagger/OpenAPI**: For API documentation
- **Postman**: For API testing and documentation
- **Jest**: For API integration testing

### Testing Examples
```javascript
// API integration tests
describe('Church API Integration', () => {
    test('should fetch church events', async () => {
        const events = await getChurchEvents();
        expect(events).toBeDefined();
        expect(Array.isArray(events.data)).toBe(true);
    });
    
    test('should handle API errors gracefully', async () => {
        const result = await apiCall('/invalid-endpoint');
        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
    });
});
```

---

## 🔮 Future API Architecture

### Microservices Approach
- **Separate Services**: Events, donations, communications
- **API Gateway**: Centralized API management
- **Service Discovery**: Dynamic service location
- **Load Balancing**: Distributed request handling

### GraphQL Consideration
```javascript
// Potential GraphQL implementation
const CHURCH_QUERY = gql`
    query ChurchData {
        events {
            id
            title
            startTime
            location
        }
        services {
            dayOfWeek
            time
            type
        }
    }
`;
```

This API reference provides a foundation for understanding current integrations and planning future API implementations for the OpenDoorPH website.
