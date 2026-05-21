import random

class DataGenerator:
    def __init__(self):
        self.locations = [
            "G-10 Markaz", "F-6 Blue Area", "Saddar Rawalpindi", "E-7 Hill View", 
            "I-8 Sector", "Bahria Phase 7", "DHA Phase 2", "Gulberg Green", 
            "Murree Road", "Expressway Junction", "Centaurus Mall Area", 
            "Shakarparian", "Saidpur Village", "Taramri Chowk", "Bara Kahu",
            "F-7 Markaz", "G-11 Markaz", "H-8 Industrial Area", "I-10 Markaz",
            "Kashmir Highway", "Faizabad Interchange", "Zero Point", "Rawat",
            "Golra Mor", "Pir Sohawa", "Margalla Hills Trail-5", "F-11 Markaz",
            "G-9 Markaz", "Blue Area Jinnah Avenue", "Diplomatic Enclave",
            "Pakistan Monument", "Convention Center", "Serena Hotel Zone",
            "PIMS Hospital Area", "Aabpara Market", "Melody Market",
            "Super Market F-6", "Karachi Company G-9", "Stock Exchange Blue Area",
        ]
        
        self.social_templates = [
            "Water level is rising at {loc}, stay safe!",
            "Emergency services needed at {loc} for localized flooding.",
            "Can't believe the rain at {loc}. Roads are completely blocked.",
            "Huge crowd gathered at {loc}, things are getting tense.",
            "Found a stray pet at {loc} during the storm. Help find the owner.",
            "Power outage reported at {loc} for the last 3 hours.",
            "Street lights are out at {loc}. Very dangerous for driving.",
            "Basement flooded in {loc}. Need water pump immediately.",
            "Tree fell on a car at {loc}. No injuries but road is closed.",
            "Avoid {loc} if you can. The drainage system has failed.",
            "Gas leak smell reported near {loc}. Evacuate the area!",
            "Multiple buildings without power at {loc}. Generator supplies needed.",
            "Manhole cover missing on main road at {loc}. Very dangerous at night.",
            "Construction crane tilting at {loc}. Area has been cordoned off.",
            "Smoke coming from an underground cable at {loc}. Fire brigade called.",
            "Loud explosion heard near {loc}. People are running away.",
            "Large sinkhole appeared on the main road at {loc} after heavy rain.",
            "Chemical spill from a tanker at {loc}. Strong fumes spreading.",
            "Bridge near {loc} has developed cracks. Traffic stopped.",
            "Protest blocking all lanes at {loc}. Commuters stranded for hours.",
            "Transformer blast at {loc}! Sparks flying everywhere.",
            "Wall collapsed at {loc} construction site. Workers may be trapped.",
            "Severe waterlogging at {loc} underpass. Cars submerged.",
            "Wild animals spotted near {loc} residential area. Children at risk.",
            "Unidentified package found at {loc}. Bomb squad alerted.",
        ]
        
        self.weather_templates = [
            "Heavy rainfall alert for {loc}: {val}mm expected in next {time} hours.",
            "Wind speeds reaching {val}km/h at {loc}. Secure outdoor objects.",
            "Thunderstorm warning for {loc}. High risk of lightning strikes.",
            "Extreme heat warning at {loc}. Temperature expected to hit {val}°C.",
            "Flash flood warning for {loc}. Residents should move to higher ground.",
            "Visibility reduced to {val}m at {loc} due to heavy fog.",
            "Hail storm reported at {loc}. Large stones observed.",
            "Air Quality Index (AQI) at {loc} has reached unhealthy level of {val}.",
            "Humidity levels at {loc} are at {val}%. Stay hydrated.",
            "Sudden temperature drop of {val}°C recorded at {loc}.",
            "Tornado watch issued for areas near {loc}. Seek shelter immediately.",
            "UV index at {loc} has crossed dangerous threshold of {val}.",
            "Dust storm approaching {loc} from the west. Visibility near zero.",
            "Freezing rain advisory at {loc}. Roads extremely slippery.",
            "Atmospheric pressure dropping rapidly near {loc}. Storm imminent.",
            "Smog level at {loc} exceeds WHO limits by {val}x. Masks required.",
            "Monsoon surge: {val}mm rain recorded in last 2 hours at {loc}.",
            "Cloud-burst warning for {loc} hill area. Landslide risk elevated.",
            "Heat index at {loc} feels like {val}°C. Outdoor activities suspended.",
            "Snow accumulation of {val}cm expected at {loc} overnight.",
        ]
        
        self.traffic_templates = [
            "Traffic jam at {loc}. Expected delay: {val} minutes.",
            "Accident reported at {loc}. Two lanes blocked.",
            "Vehicle breakdown at {loc} causing major tailbacks.",
            "Road construction at {loc} starting today. Traffic diverted.",
            "Signal failure at {loc}. Police directing traffic manually.",
            "Protest at {loc} has stopped all traffic movement.",
            "Oil spill at {loc}. Drive with extreme caution.",
            "VIP movement expected at {loc}. Roads will be closed briefly.",
            "Overturned truck at {loc}. Recovery in progress.",
            "Pothole repair at {loc} causing slow-moving traffic.",
            "Multi-car pileup at {loc}. Emergency vehicles on scene.",
            "School zone congestion at {loc}. Expect {val} min delays.",
            "Water main burst flooding road surface at {loc}.",
            "Stalled fuel tanker at {loc} causing hazmat concerns.",
            "Wrong-way driver reported near {loc}. Use extreme caution.",
            "Pedestrian struck at {loc} crosswalk. Ambulance dispatched.",
            "Bridge closure at {loc} for maintenance. Detour via alternate route.",
            "Bus broke down at {loc} bus stop. Blocking entire lane.",
            "High-speed chase reported near {loc}. Stay off the road.",
            "Road flooded at {loc} underpass. Depth approximately {val}cm.",
            "Tire debris scattered on highway near {loc}. Lane hazard.",
            "Motorcycle rally at {loc}. Heavy congestion expected for {val} min.",
        ]

        self.power_templates = [
            "Complete power blackout at {loc}. Estimated restore: {val} hours.",
            "Transformer explosion at {loc}. Fire department responding.",
            "Voltage fluctuation damaging appliances at {loc}. IESCO notified.",
            "Load-shedding extended to {val} hours at {loc} today.",
            "Underground cable fault at {loc}. Repair crew dispatched.",
            "Solar panel farm at {loc} offline due to hail damage.",
            "Grid overload warning for {loc} sector. Rolling blackouts possible.",
            "Emergency generator running at {loc} hospital after grid failure.",
            "Street light circuit failure at {loc}. Entire block dark.",
            "High-tension wire down at {loc}. Area extremely dangerous.",
        ]

        self.medical_templates = [
            "Mass casualty event near {loc}. {val} injured reported.",
            "Food poisoning outbreak at {loc} restaurant. {val} affected.",
            "Heatstroke cases surging at {loc}. Medical camps needed.",
            "Toxic fumes from factory near {loc}. Residents complaining of breathing issues.",
            "Water contamination reported at {loc}. Do not drink tap water.",
            "Dengue fever cluster detected at {loc}. Fumigation required.",
            "Hospital at {loc} running out of oxygen supply.",
            "Road accident victims being rushed to {loc} hospital. Blood donors needed.",
            "Allergic reaction cases spiking at {loc} due to pollen levels.",
            "Ambulance stuck in traffic near {loc}. Patient critical.",
        ]

        self.security_templates = [
            "Suspicious vehicle parked near {loc} government building.",
            "Armed robbery reported at {loc} bank. Police en route.",
            "Crowd disturbance at {loc} market. Situation escalating.",
            "Fire alarm triggered at {loc} commercial plaza. Evacuating.",
            "Unauthorized drone spotted over {loc} restricted zone.",
            "Missing child alert near {loc} park area. Age approximately {val}.",
            "Vandalism reported at {loc} public property. CCTV footage being reviewed.",
            "Gas cylinder explosion at {loc} restaurant. Injuries reported.",
            "Knife attack near {loc} metro station. Suspect fleeing on foot.",
            "Illegal fireworks at {loc} causing panic among residents.",
        ]
        
        self.last_sent = {
            "social": None,
            "weather": None,
            "traffic": None,
            "power": None,
            "medical": None,
            "security": None,
        }

    def generate_random(self, category):
        loc = random.choice(self.locations)
        
        if category == "social":
            text = random.choice(self.social_templates).format(loc=loc)
            source = "social_media"
            severity = random.choice(["MEDIUM", "HIGH"])
        elif category == "weather":
            val = random.randint(10, 100)
            t = random.randint(1, 6)
            text = random.choice(self.weather_templates).format(loc=loc, val=val, time=t)
            source = "weather_api"
            severity = "HIGH" if val > 50 else "MEDIUM"
        elif category == "traffic":
            val = random.randint(15, 90)
            text = random.choice(self.traffic_templates).format(loc=loc, val=val)
            source = "traffic_sensors"
            severity = "HIGH" if val > 40 else "LOW"
        elif category == "power":
            val = random.randint(1, 12)
            text = random.choice(self.power_templates).format(loc=loc, val=val)
            source = "grid_sensors"
            severity = "CRITICAL" if val > 6 else "HIGH"
        elif category == "medical":
            val = random.randint(3, 50)
            text = random.choice(self.medical_templates).format(loc=loc, val=val)
            source = "health_dept"
            severity = "CRITICAL" if val > 20 else "HIGH"
        elif category == "security":
            val = random.randint(5, 15)
            text = random.choice(self.security_templates).format(loc=loc, val=val)
            source = "security_cam"
            severity = "CRITICAL"
        else:
            return None

        # Ensure it's different from the last one
        if text == self.last_sent.get(category):
            return self.generate_random(category)
            
        self.last_sent[category] = text
        return {
            "source": source,
            "text": text,
            "location": loc,
            "severity": severity
        }

generator = DataGenerator()
