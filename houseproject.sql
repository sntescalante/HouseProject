-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: houseproject
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `actuator`
--

DROP TABLE IF EXISTS `actuator`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `actuator` (
  `ActuatorID` int(11) NOT NULL,
  `LocationID` int(11) DEFAULT NULL,
  `SystemID` int(11) DEFAULT NULL,
  `Type` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ActuatorID`),
  KEY `LocationID` (`LocationID`),
  KEY `SystemID` (`SystemID`),
  CONSTRAINT `actuator_ibfk_1` FOREIGN KEY (`LocationID`) REFERENCES `location` (`LocationID`),
  CONSTRAINT `actuator_ibfk_2` FOREIGN KEY (`SystemID`) REFERENCES `systems` (`SystemID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actuator`
--

LOCK TABLES `actuator` WRITE;
/*!40000 ALTER TABLE `actuator` DISABLE KEYS */;
/*!40000 ALTER TABLE `actuator` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `actuatorvalues`
--

DROP TABLE IF EXISTS `actuatorvalues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `actuatorvalues` (
  `ValueID` int(11) NOT NULL,
  `ActuatorID` int(11) DEFAULT NULL,
  `DateTime` datetime DEFAULT NULL,
  `State` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ValueID`),
  KEY `ActuatorID` (`ActuatorID`),
  CONSTRAINT `actuatorvalues_ibfk_1` FOREIGN KEY (`ActuatorID`) REFERENCES `actuator` (`ActuatorID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actuatorvalues`
--

LOCK TABLES `actuatorvalues` WRITE;
/*!40000 ALTER TABLE `actuatorvalues` DISABLE KEYS */;
/*!40000 ALTER TABLE `actuatorvalues` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event`
--

DROP TABLE IF EXISTS `event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `event` (
  `EventID` int(11) NOT NULL,
  `SystemID` int(11) DEFAULT NULL,
  `Type` varchar(100) DEFAULT NULL,
  `Description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`EventID`),
  KEY `SystemID` (`SystemID`),
  CONSTRAINT `event_ibfk_1` FOREIGN KEY (`SystemID`) REFERENCES `systems` (`SystemID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event`
--

LOCK TABLES `event` WRITE;
/*!40000 ALTER TABLE `event` DISABLE KEYS */;
/*!40000 ALTER TABLE `event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `location`
--

DROP TABLE IF EXISTS `location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `location` (
  `LocationID` int(11) NOT NULL,
  `Name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`LocationID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `location`
--

LOCK TABLES `location` WRITE;
/*!40000 ALTER TABLE `location` DISABLE KEYS */;
/*!40000 ALTER TABLE `location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `microcontroller`
--

DROP TABLE IF EXISTS `microcontroller`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `microcontroller` (
  `MicroID` int(11) NOT NULL,
  `Model` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`MicroID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `microcontroller`
--

LOCK TABLES `microcontroller` WRITE;
/*!40000 ALTER TABLE `microcontroller` DISABLE KEYS */;
/*!40000 ALTER TABLE `microcontroller` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `microcontrollerstate`
--

DROP TABLE IF EXISTS `microcontrollerstate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `microcontrollerstate` (
  `MicroID` int(11) NOT NULL,
  `DateTime` datetime NOT NULL,
  `State` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`MicroID`,`DateTime`),
  CONSTRAINT `microcontrollerstate_ibfk_1` FOREIGN KEY (`MicroID`) REFERENCES `microcontroller` (`MicroID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `microcontrollerstate`
--

LOCK TABLES `microcontrollerstate` WRITE;
/*!40000 ALTER TABLE `microcontrollerstate` DISABLE KEYS */;
/*!40000 ALTER TABLE `microcontrollerstate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sensor`
--

DROP TABLE IF EXISTS `sensor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sensor` (
  `SensorID` int(11) NOT NULL,
  `LocationID` int(11) DEFAULT NULL,
  `SystemID` int(11) DEFAULT NULL,
  `Type` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`SensorID`),
  KEY `LocationID` (`LocationID`),
  KEY `SystemID` (`SystemID`),
  CONSTRAINT `sensor_ibfk_1` FOREIGN KEY (`LocationID`) REFERENCES `location` (`LocationID`),
  CONSTRAINT `sensor_ibfk_2` FOREIGN KEY (`SystemID`) REFERENCES `systems` (`SystemID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sensor`
--

LOCK TABLES `sensor` WRITE;
/*!40000 ALTER TABLE `sensor` DISABLE KEYS */;
/*!40000 ALTER TABLE `sensor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sensorreadings`
--

DROP TABLE IF EXISTS `sensorreadings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sensorreadings` (
  `ReadingID` int(11) NOT NULL,
  `SensorID` int(11) DEFAULT NULL,
  `DateTime` datetime DEFAULT NULL,
  `Reading` float DEFAULT NULL,
  `Unit` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ReadingID`),
  KEY `SensorID` (`SensorID`),
  CONSTRAINT `sensorreadings_ibfk_1` FOREIGN KEY (`SensorID`) REFERENCES `sensor` (`SensorID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sensorreadings`
--

LOCK TABLES `sensorreadings` WRITE;
/*!40000 ALTER TABLE `sensorreadings` DISABLE KEYS */;
/*!40000 ALTER TABLE `sensorreadings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `systems`
--

DROP TABLE IF EXISTS `systems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `systems` (
  `SystemID` int(11) NOT NULL,
  `MicroID` int(11) DEFAULT NULL,
  `Name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`SystemID`),
  KEY `MicroID` (`MicroID`),
  CONSTRAINT `systems_ibfk_1` FOREIGN KEY (`MicroID`) REFERENCES `microcontroller` (`MicroID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `systems`
--

LOCK TABLES `systems` WRITE;
/*!40000 ALTER TABLE `systems` DISABLE KEYS */;
/*!40000 ALTER TABLE `systems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `systemstate`
--

DROP TABLE IF EXISTS `systemstate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `systemstate` (
  `SystemID` int(11) NOT NULL,
  `DateTime` datetime NOT NULL,
  `State` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`SystemID`,`DateTime`),
  CONSTRAINT `systemstate_ibfk_1` FOREIGN KEY (`SystemID`) REFERENCES `systems` (`SystemID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `systemstate`
--

LOCK TABLES `systemstate` WRITE;
/*!40000 ALTER TABLE `systemstate` DISABLE KEYS */;
/*!40000 ALTER TABLE `systemstate` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-26 21:50:57
