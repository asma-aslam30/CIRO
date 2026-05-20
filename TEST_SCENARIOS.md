# CIRO System Test Scenarios

This document outlines 5 testing scenarios to verify the integration and intelligence of the Crisis Intelligence & Response Orchestrator.

## 1. Urban Flooding (High Severity)
**Objective**: Test detection of weather-related crises and drainage response.
- **Signals**:
  - "Water levels rising quickly in F-6 Markaz!"
  - "Basements flooded in several houses. Need help."
  - "Heavy rain causing massive puddles on main roads."
- **Expected Outcome**:
  - **Crisis**: Urban Flooding
  - **Actions**: Rescue Dispatch, Drainage Activation, Public SMS Alert.

## 2. Structural Fire (Critical Severity)
**Objective**: Test high-severity trigger and multi-department coordination.
- **Signals**:
  - "Huge fire at the commercial building in Blue Area!"
  - "Thick black smoke visible from miles away."
  - "People trapped on the 4th floor! Help!"
- **Expected Outcome**:
  - **Crisis**: Structural Fire
  - **Actions**: Fire Dept Dispatch, Area Evacuation, Power Isolation, Medical Triage.

## 3. Major Traffic Incident (Medium Severity)
**Objective**: Test sensor-signal correlation and traffic management.
- **Signals**:
  - "Multi-car pileup on the expressway."
  - "Road blocked near the bridge. Traffic at a standstill."
  - "Avoid the expressway! Massive accident."
- **Expected Outcome**:
  - **Crisis**: Major Traffic Incident
  - **Actions**: Lane Closure, Towing Service, Digital Signage Update.

## 4. Extreme Heatwave (Low Severity)
**Objective**: Test public health response and non-immediate physical threats.
- **Signals**:
  - "It's 45 degrees outside. Too hot to walk."
  - "Old lady fainted at the bus stop due to heat."
  - "Temperatures reaching record highs today."
- **Expected Outcome**:
  - **Crisis**: Extreme Heatwave
  - **Actions**: Cooling Center Opening, Hydration Alert, Energy Advisory.

## 5. False Alarm / Normal State
**Objective**: Test system resilience to unrelated noise.
- **Signals**:
  - "Beautiful weather in Islamabad today!"
  - "Coffee at Markaz is great."
- **Expected Outcome**:
  - **Crisis**: General Emergency (or None if filtering was stricter)
  - **Actions**: Standard Signal Monitoring.
