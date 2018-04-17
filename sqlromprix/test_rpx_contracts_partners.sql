-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: localhost    Database: test
-- ------------------------------------------------------
-- Server version	5.5.5-10.1.30-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `rpx_contracts_partners`
--

DROP TABLE IF EXISTS `rpx_contracts_partners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rpx_contracts_partners` (
  `ContractPartID` int(11) NOT NULL AUTO_INCREMENT,
  `OrganisationID` int(11) NOT NULL,
  `OrganisationDepartmentID` int(11) DEFAULT NULL,
  `ContractID` int(11) NOT NULL,
  `ResponsableID` int(11) DEFAULT NULL,
  `ResponsableCode` varchar(100) CHARACTER SET utf8mb4 DEFAULT NULL,
  `ContractPartTypeID` int(11) NOT NULL,
  `Description` varchar(100) CHARACTER SET utf8mb4 DEFAULT NULL,
  `Active` bit(1) DEFAULT NULL,
  `DateAdd` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UserIDAdd` int(11) NOT NULL,
  `UserIDEdit` int(11) DEFAULT NULL,
  `DateEdit` datetime DEFAULT NULL,
  `Deleted` bit(1) DEFAULT NULL,
  `UserIDDeleted` int(11) DEFAULT NULL,
  `DateDeleted` datetime DEFAULT NULL,
  PRIMARY KEY (`ContractPartID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rpx_contracts_partners`
--

LOCK TABLES `rpx_contracts_partners` WRITE;
/*!40000 ALTER TABLE `rpx_contracts_partners` DISABLE KEYS */;
/*!40000 ALTER TABLE `rpx_contracts_partners` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-04-17 16:27:44
