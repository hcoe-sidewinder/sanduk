"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AnimatedBackground from "@/components/AnimatedBackground";
import * as d3 from "d3";

const { width, height } = Dimensions.get("window");

const memberData = {
  memberId: 1,
  events: [
    {
      id: 1,
      date: "2024-01-15",
      type: "Vaccination",
      description: "COVID-19 Booster",
      location: "City Health Center",
      notes: "No side effects reported. Next dose due in 6 months.",
    },
    {
      id: 2,
      date: "2024-02-20",
      type: "Dental",
      description: "Routine Cleaning",
      location: "Dental Clinic",
      notes: "Good oral health. Recommended flossing daily.",
    },
    {
      id: 3,
      date: "2024-03-10",
      type: "Checkup",
      description: "Annual Physical",
      location: "General Hospital",
      notes: "All vitals normal. Blood pressure slightly elevated.",
    },
    {
      id: 4,
      date: "2023-12-05",
      type: "Vaccination",
      description: "Flu Shot",
      location: "Pharmacy",
      notes: "Seasonal flu vaccination completed.",
    },
    {
      id: 5,
      date: "2023-11-18",
      type: "Dental",
      description: "Cavity Filling",
      location: "Dental Clinic",
      notes: "Upper molar filled. Follow-up in 2 weeks.",
    },
    {
      id: 6,
      date: "2023-10-22",
      type: "Eye Exam",
      description: "Vision Test",
      location: "Eye Care Center",
      notes: "Prescription updated. New glasses recommended.",
    },
  ],
};

const healthFacilities = [
  {
    id: 1,
    title: "COVID-19 Vaccination Information",
    description:
      "Latest updates on COVID-19 vaccination campaigns and schedules across Nepal",
    publishedDate: "2024-01-20",
    location: "Nationwide",
    type: "Vaccination",
    isNew: true,
    link: "https://mohp.gov.np/eng/program/free-health-care-program",
  },
  {
    id: 2,
    title: "WHO Nepal Health Services",
    description:
      "World Health Organization programs and health initiatives in Nepal",
    publishedDate: "2024-01-18",
    location: "All Provinces",
    type: "Health Programs",
    isNew: true,
    link: "https://www.who.int/nepal",
  },
  {
    id: 3,
    title: "Free Health Care Program - MOHP",
    description:
      "Ministry of Health and Population free healthcare services and facilities",
    publishedDate: "2024-01-15",
    location: "Government Hospitals",
    type: "Free Healthcare",
    isNew: false,
    link: "https://mohp.gov.np/eng/program/free-health-care-program",
  },
  {
    id: 4,
    title: "National Immunization Program",
    description:
      "Routine immunization schedule and vaccination programs for all age groups",
    publishedDate: "2024-01-12",
    location: "All Health Centers",
    type: "Immunization",
    isNew: false,
    link: "https://mohp.gov.np/eng/program/child-health-program",
  },
  {
    id: 5,
    title: "Maternal and Child Health Services",
    description:
      "Comprehensive maternal and child health programs including prenatal care",
    publishedDate: "2024-01-10",
    location: "Primary Health Centers",
    type: "Maternal Care",
    isNew: false,
    link: "https://mohp.gov.np/eng/program/safe-motherhood-program",
  },
];

interface HealthEvent {
  id: number;
  date: string;
  type: string;
  description: string;
  location?: string | undefined;
  notes?: string;
}

interface TimelineEventProps {
  event: HealthEvent;
  index: number;
  isUpcoming?: boolean;

  onPress: (event: HealthEvent) => void;
  onDelete: (event: HealthEvent) => void;
}

const TimelineEvent: React.FC<TimelineEventProps> = ({
  event,
  index,
  isUpcoming = false,
  onPress,
  onDelete,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const colors = {
    primary: "#8b5cf6",
    primaryLight: "#a78bfa",
    primaryDark: "#7c3aed",
    primaryVeryLight: "#ddd6fe",
    text: "#1f2937",
    textSecondary: "#6b7280",
    surface: "#ffffff",
    background: "#f8fafc",
  };

  useEffect(() => {
    const delay = index * 100;
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);
  }, [fadeAnim, slideAnim, index]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onPress(event);
    });
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Event",
      `Are you sure you want to delete this ${event.type} event?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }).start(() => {
              onDelete(event);
            });
          },
        },
      ]
    );
  };

  const eventDate = new Date(event.date);
  const isThisMonth = eventDate.getMonth() === new Date().getMonth();

  return (
    <Animated.View
      style={[
        styles.timelineEvent,
        {
          backgroundColor: isUpcoming ? "#8b5cf6" : colors.surface,
          borderLeftColor: "#8b5cf6",
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity onPress={handlePress} style={styles.eventTouchable}>
        <View style={styles.eventHeader}>
          <View style={styles.eventInfo}>
            <Text style={[styles.eventType, { color: colors.text }]}>
              {event.type}
            </Text>
            <Text
              style={[styles.eventDescription, { color: colors.textSecondary }]}
            >
              {event.description}
            </Text>
            {event.location && (
              <Text
                style={[styles.eventLocation, { color: colors.textSecondary }]}
              >
                📍 {event.location}
              </Text>
            )}
          </View>
          <View style={styles.eventActions}>
            <View style={styles.eventDate}>
              <Text style={[styles.eventDateText, { color: "#8b5cf6" }]}>
                {d3.timeFormat("%b %d")(eventDate)}
              </Text>
              <Text style={[styles.eventYear, { color: colors.textSecondary }]}>
                {d3.timeFormat("%Y")(eventDate)}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleDelete}
              style={[
                styles.deleteButton,
                { backgroundColor: colors.primaryVeryLight },
              ]}
            >
              <Text style={styles.deleteIcon}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>

      {isThisMonth && (
        <View
          style={[styles.currentMonthBadge, { backgroundColor: "#8b5cf6" }]}
        >
          <Text style={styles.currentMonthText}>This Month</Text>
        </View>
      )}
      {isUpcoming && (
        <View
          style={[
            styles.upcomingBadge,
            { backgroundColor: colors.primaryLight },
          ]}
        >
          <Text style={styles.upcomingText}>Upcoming</Text>
        </View>
      )}
    </Animated.View>
  );
};

interface EventDetailModalProps {
  visible: boolean;
  event: HealthEvent | null;
  onClose: () => void;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({
  visible,
  event,
  onClose,
}) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const colors = {
    primary: "#8b5cf6",
    primaryLight: "#a78bfa",
    primaryDark: "#7c3aed",
    primaryVeryLight: "#ddd6fe",
    text: "#1f2937",
    textSecondary: "#6b7280",
    surface: "#ffffff",
  };

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, fadeAnim]);

  if (!event) return null;

  const eventDate = new Date(event.date);

  return (
    <Modal visible={visible} transparent animationType="none">
      <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.modalBackdrop} onPress={onClose} />
        <Animated.View
          style={[
            styles.eventModalContent,
            {
              backgroundColor: colors.surface,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View
            style={[styles.eventModalHeader, { borderBottomColor: "#8b5cf6" }]}
          >
            <View style={styles.eventModalTitleSection}>
              <View style={styles.eventModalTitleText}>
                <Text style={[styles.eventModalTitle, { color: colors.text }]}>
                  {event.type}
                </Text>
                <Text style={[styles.eventModalDate, { color: "#8b5cf6" }]}>
                  {d3.timeFormat("%B %d, %Y")(eventDate)}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={[
                styles.eventCloseButton,
                { backgroundColor: colors.primaryVeryLight },
              ]}
            >
              <Text style={styles.eventCloseButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.eventModalBody}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.eventDetailSection}>
              <Text
                style={[
                  styles.eventDetailLabel,
                  { color: colors.textSecondary },
                ]}
              >
                Description
              </Text>
              <Text style={[styles.eventDetailValue, { color: colors.text }]}>
                {event.description}
              </Text>
            </View>

            {event.location && (
              <View style={styles.eventDetailSection}>
                <Text
                  style={[
                    styles.eventDetailLabel,
                    { color: colors.textSecondary },
                  ]}
                >
                  Location
                </Text>
                <View style={styles.locationRow}>
                  <Text style={styles.locationIcon}>📍</Text>
                  <Text
                    style={[styles.eventDetailValue, { color: colors.text }]}
                  >
                    {event.location}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.eventDetailSection}>
              <Text
                style={[
                  styles.eventDetailLabel,
                  { color: colors.textSecondary },
                ]}
              >
                Date & Time
              </Text>
              <Text style={[styles.eventDetailValue, { color: colors.text }]}>
                {d3.timeFormat("%A, %B %d, %Y")(eventDate)}
              </Text>
            </View>

            {event.notes && (
              <View style={styles.eventDetailSection}>
                <Text
                  style={[
                    styles.eventDetailLabel,
                    { color: colors.textSecondary },
                  ]}
                >
                  Notes
                </Text>
                <View
                  style={[
                    styles.notesContainer,
                    {
                      backgroundColor: colors.primaryVeryLight,
                      borderColor: "#8b5cf6",
                    },
                  ]}
                >
                  <Text
                    style={[styles.eventDetailValue, { color: colors.text }]}
                  >
                    {event.notes}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.eventDetailSection}>
              <Text
                style={[
                  styles.eventDetailLabel,
                  { color: colors.textSecondary },
                ]}
              >
                Event Type
              </Text>
              <View style={[styles.typeTag, { backgroundColor: "#8b5cf6" }]}>
                <Text style={[styles.typeTagText, { color: "#8b5cf6" }]}>
                  {event.type}
                </Text>
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

interface FacilityCardProps {
  facility: any;
  index: number;
}

const FacilityCard: React.FC<FacilityCardProps> = ({ facility, index }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const colors = {
    primary: "#8b5cf6",
    primaryLight: "#a78bfa",
    primaryDark: "#7c3aed",
    primaryVeryLight: "#ddd6fe",
    text: "#1f2937",
    textSecondary: "#6b7280",
    surface: "#ffffff",
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "vaccination":
        return colors.primary;
      case "health programs":
        return colors.primaryLight;
      case "free healthcare":
        return colors.primaryDark;
      case "immunization":
        return "#9333ea";
      case "maternal care":
        return "#7e22ce";
      default:
        return colors.primary;
    }
  };

  useEffect(() => {
    const delay = index * 150;
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);
  }, [fadeAnim, scaleAnim, index]);

  const handlePress = () => {
    Alert.alert("Open Link", `Would you like to visit ${facility.title}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Open", onPress: () => console.log("Opening:", facility.link) },
    ]);
  };

  const typeColor = getTypeColor(facility.type);
  const publishedDate = new Date(facility.publishedDate);
  const daysAgo = Math.floor(
    (new Date().getTime() - publishedDate.getTime()) / (1000 * 3600 * 24)
  );

  return (
    <Animated.View
      style={[
        styles.facilityCard,
        {
          backgroundColor: colors.surface,
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity onPress={handlePress} style={styles.facilityContent}>
        <View style={styles.facilityHeader}>
          <View style={styles.facilityInfo}>
            <Text style={[styles.facilityTitle, { color: colors.text }]}>
              {facility.title}
            </Text>
            <Text style={[styles.facilityType, { color: typeColor }]}>
              {facility.type}
            </Text>
          </View>
          {facility.isNew && (
            <View
              style={[styles.newBadge, { backgroundColor: colors.primaryDark }]}
            >
              <Text style={styles.newBadgeText}>NEW</Text>
            </View>
          )}
        </View>

        <Text
          style={[styles.facilityDescription, { color: colors.textSecondary }]}
        >
          {facility.description}
        </Text>

        <View style={styles.facilityFooter}>
          <View style={styles.locationInfo}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text
              style={[styles.locationText, { color: colors.textSecondary }]}
            >
              {facility.location}
            </Text>
          </View>
          <Text style={[styles.publishedDate, { color: colors.textSecondary }]}>
            {daysAgo === 0 ? "Today" : `${daysAgo} days ago`}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

interface AddEventModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (event: HealthEvent) => void;
}

const AddEventModal: React.FC<AddEventModalProps> = ({
  visible,
  onClose,
  onAdd,
}) => {
  const [eventType, setEventType] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedDate] = useState(new Date());

  const colors = {
    primary: "#8b5cf6",
    primaryLight: "#a78bfa",
    primaryDark: "#7c3aed",
    primaryVeryLight: "#ddd6fe",
    text: "#1f2937",
    textSecondary: "#6b7280",
    surface: "#ffffff",
  };

  const eventTypes = [
    "Vaccination",
    "Dental",
    "Checkup",
    "Eye Exam",
    "Surgery",
    "Treatment",
  ];

  const handleAdd = () => {
    if (eventType && description) {
      onAdd({
        id: Date.now(),
        date: selectedDate.toISOString().split("T")[0],
        type: eventType,
        description,
        location: location || undefined,
        notes: notes || undefined,
      });
      setEventType("");
      setDescription("");
      setLocation("");
      setNotes("");
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View
          style={[styles.modalContent, { backgroundColor: colors.surface }]}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Add Health Event
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text
                style={[styles.closeButton, { color: colors.textSecondary }]}
              >
                ✕
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Event Type
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.typeSelector}
            >
              {eventTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setEventType(type)}
                  style={[
                    styles.typeButton,
                    {
                      backgroundColor:
                        eventType === type
                          ? colors.primary
                          : colors.primaryVeryLight,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      {
                        color:
                          eventType === type ? "#ffffff" : colors.primaryDark,
                      },
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Description
            </Text>
            <TextInput
              style={[
                styles.textInput,
                { borderColor: colors.primaryVeryLight, color: colors.text },
              ]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter event description"
              placeholderTextColor={colors.textSecondary}
            />

            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Location (Optional)
            </Text>
            <TextInput
              style={[
                styles.textInput,
                { borderColor: colors.primaryVeryLight, color: colors.text },
              ]}
              value={location}
              onChangeText={setLocation}
              placeholder="Enter location"
              placeholderTextColor={colors.textSecondary}
            />

            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Notes (Optional)
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  borderColor: colors.primaryVeryLight,
                  color: colors.text,
                  minHeight: 80,
                },
              ]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Enter additional notes"
              placeholderTextColor={colors.textSecondary}
              multiline
              textAlignVertical="top"
            />

            <TouchableOpacity
              onPress={handleAdd}
              style={[styles.addButton, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.addButtonText}>Add Event</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default function MemberAlertsScreen() {
  const [activeTab, setActiveTab] = useState<"timeline" | "facilities">(
    "timeline"
  );
  const [events, setEvents] = useState(memberData.events);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<HealthEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);

  const tabIndicatorAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const colors = {
    primary: "#8b5cf6",
    primaryLight: "#a78bfa",
    primaryDark: "#7c3aed",
    primaryVeryLight: "#ddd6fe",
    text: "#1f2937",
    textSecondary: "#6b7280",
    surface: "#ffffff",
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    Animated.timing(tabIndicatorAnim, {
      toValue: activeTab === "timeline" ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [activeTab, tabIndicatorAnim]);

  const handleAddEvent = (newEvent: HealthEvent) => {
    setEvents([...events]);
  };

  const handleEventPress = (event: HealthEvent) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleDeleteEvent = (eventToDelete: HealthEvent) => {
    setEvents(events.filter((event) => event.id !== eventToDelete.id));
  };

  const handleCloseEventModal = () => {
    setShowEventModal(false);
    setTimeout(() => setSelectedEvent(null), 300);
  };

  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const now = new Date();
  const pastEvents = sortedEvents.filter(
    (event) => new Date(event.date) <= now
  );
  const upcomingEvents = sortedEvents.filter(
    (event) => new Date(event.date) > now
  );

  const newFacilitiesCount = healthFacilities.filter(
    (facility) => facility.isNew
  ).length;

  return (
    <AnimatedBackground>
      <SafeAreaView style={styles.container}>
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <View style={styles.memberInfo}>
            <View style={styles.memberDetails}>
              <Text
                style={[styles.memberSubtitle, { color: colors.textSecondary }]}
              >
                Health Alerts & Timeline
              </Text>
            </View>
          </View>
        </Animated.View>

        <View
          style={[styles.tabContainer, { backgroundColor: colors.surface }]}
        >
          <View style={styles.tabButtons}>
            <TouchableOpacity
              onPress={() => setActiveTab("timeline")}
              style={[
                styles.tabButton,
                activeTab === "timeline" && styles.activeTabButton,
              ]}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  {
                    color:
                      activeTab === "timeline"
                        ? colors.primary
                        : colors.textSecondary,
                  },
                ]}
              >
                📅 Timeline
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab("facilities")}
              style={[
                styles.tabButton,
                activeTab === "facilities" && styles.activeTabButton,
              ]}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  {
                    color:
                      activeTab === "facilities"
                        ? colors.primary
                        : colors.textSecondary,
                  },
                ]}
              >
                🏥 Health Services
              </Text>
              {newFacilitiesCount > 0 && (
                <View
                  style={[
                    styles.tabBadge,
                    { backgroundColor: colors.primaryDark },
                  ]}
                >
                  <Text style={styles.tabBadgeText}>{newFacilitiesCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <Animated.View
            style={[
              styles.tabIndicator,
              {
                backgroundColor: colors.primary,
                transform: [
                  {
                    translateX: tabIndicatorAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, width / 2 - 32],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>

        {activeTab === "timeline" ? (
          <ScrollView
            style={styles.tabContent}
            showsVerticalScrollIndicator={false}
          >
            <TouchableOpacity
              onPress={() => setShowAddModal(true)}
              style={[
                styles.addEventButton,
                { backgroundColor: colors.primary },
              ]}
            >
              <Text style={styles.addEventIcon}>➕</Text>
              <Text style={styles.addEventText}>Add New Health Event</Text>
            </TouchableOpacity>

            {upcomingEvents.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  📅 Upcoming Events
                </Text>
                {upcomingEvents.map((event, index) => (
                  <TimelineEvent
                    key={`upcoming-${event.id}`}
                    event={event}
                    index={index}
                    isUpcoming
                    onPress={handleEventPress}
                    onDelete={handleDeleteEvent}
                  />
                ))}
              </View>
            )}

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                📋 Past Records
              </Text>
              {pastEvents.map((event, index) => (
                <TimelineEvent
                  key={`past-${event.id}`}
                  event={event}
                  index={index}
                  onPress={handleEventPress}
                  onDelete={handleDeleteEvent}
                />
              ))}
            </View>
          </ScrollView>
        ) : (
          <ScrollView
            style={styles.tabContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                🏥 Nepal Government Health Services
              </Text>
              <Text
                style={[
                  styles.sectionSubtitle,
                  { color: colors.textSecondary },
                ]}
              >
                Latest health facilities and programs available nationwide
              </Text>
              {healthFacilities.map((facility, index) => (
                <FacilityCard
                  key={facility.id}
                  facility={facility}
                  index={index}
                />
              ))}
            </View>
          </ScrollView>
        )}

        <AddEventModal
          visible={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddEvent}
        />

        <EventDetailModal
          visible={showEventModal}
          event={selectedEvent}
          onClose={handleCloseEventModal}
        />
      </SafeAreaView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginBottom: 16,
  },
  memberInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  memberAvatar: {
    fontSize: 40,
    marginRight: 16,
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  memberSubtitle: {
    fontSize: 14,
  },
  tabContainer: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 4,
    marginBottom: 16,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tabButtons: {
    flexDirection: "row",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    position: "relative",
  },
  activeTabButton: {
    backgroundColor: "transparent",
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  tabBadge: {
    marginLeft: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  tabBadgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  tabIndicator: {
    position: "absolute",
    bottom: 4,
    left: 4,
    width: width / 2 - 32,
    height: 2,
    borderRadius: 1,
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  addEventButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  addEventIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  addEventText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  timelineEvent: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    position: "relative",
  },
  eventTouchable: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  eventIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  eventEmoji: {
    fontSize: 20,
  },
  eventInfo: {
    flex: 1,
  },
  eventType: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 12,
    fontStyle: "italic",
  },
  eventActions: {
    alignItems: "flex-end",
  },
  eventDate: {
    alignItems: "flex-end",
    marginBottom: 8,
  },
  eventDateText: {
    fontSize: 14,
    fontWeight: "600",
  },
  eventYear: {
    fontSize: 12,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteIcon: {
    fontSize: 14,
  },
  currentMonthBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  currentMonthText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "bold",
  },
  upcomingBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  upcomingText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "bold",
  },
  facilityCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  facilityContent: {
    flex: 1,
  },
  facilityHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  facilityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  facilityEmoji: {
    fontSize: 20,
  },
  facilityInfo: {
    flex: 1,
  },
  facilityTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  facilityType: {
    fontSize: 12,
    fontWeight: "500",
  },
  newBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  newBadgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "bold",
  },
  facilityDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  facilityFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  locationIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  locationText: {
    fontSize: 12,
  },
  publishedDate: {
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  closeButton: {
    fontSize: 24,
    fontWeight: "600",
  },
  modalBody: {
    padding: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  typeSelector: {
    marginBottom: 24,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 24,
    minHeight: 50,
  },
  addButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  // Event Detail Modal Styles
  eventModalContent: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: height * 0.85,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
  eventModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    borderBottomWidth: 2,
  },
  eventModalTitleSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  eventModalIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  eventModalEmoji: {
    fontSize: 28,
  },
  eventModalTitleText: {
    flex: 1,
  },
  eventModalTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  eventModalDate: {
    fontSize: 16,
    fontWeight: "600",
  },
  eventCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  eventCloseButtonText: {
    fontSize: 18,
    fontWeight: "600",
  },
  eventModalBody: {
    padding: 24,
  },
  eventDetailSection: {
    marginBottom: 24,
  },
  eventDetailLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  eventDetailValue: {
    fontSize: 16,
    lineHeight: 24,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  notesContainer: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  typeTag: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  typeTagText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
