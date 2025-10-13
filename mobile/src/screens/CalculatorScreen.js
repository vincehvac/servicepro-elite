import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Alert
} from 'react-native';

const CalculatorScreen = ({ navigation }) => {
  const [activeCalculator, setActiveCalculator] = useState('load');
  
  // Load Calculation (Manual J) State
  const [loadInputs, setLoadInputs] = useState({
    squareFootage: '',
    ceilingHeight: '',
    insulation: 'R-13',
    windows: '',
    doors: '',
    occupants: '',
    climate: 'moderate'
  });
  
  // Duct Sizing State
  const [ductInputs, setDuctInputs] = useState({
    cfm: '',
    velocity: '900',
    ductType: 'round'
  });
  
  // Refrigerant Charge State
  const [refrigerantInputs, setRefrigerantInputs] = useState({
    superheat: '',
    subcool: '',
    outdoorTemp: '',
    indoorTemp: '',
    refrigerantType: 'R-410A'
  });
  
  // Electrical Load State
  const [electricalInputs, setElectricalInputs] = useState({
    voltage: '240',
    amperage: '',
    powerFactor: '0.9'
  });

  // Load Calculation (Manual J)
  const calculateLoad = () => {
    const sqft = parseFloat(loadInputs.squareFootage);
    const height = parseFloat(loadInputs.ceilingHeight) || 8;
    const windows = parseInt(loadInputs.windows) || 0;
    const doors = parseInt(loadInputs.doors) || 0;
    const occupants = parseInt(loadInputs.occupants) || 2;
    
    if (!sqft) {
      Alert.alert('Error', 'Please enter square footage');
      return;
    }
    
    // Simplified Manual J calculation
    let baseLoad = sqft * 25; // Base BTU per sq ft
    
    // Adjust for ceiling height
    if (height > 8) {
      baseLoad *= (height / 8);
    }
    
    // Add window load
    baseLoad += windows * 1000;
    
    // Add door load
    baseLoad += doors * 500;
    
    // Add occupant load
    baseLoad += occupants * 400;
    
    // Climate adjustment
    const climateFactors = {
      hot: 1.3,
      moderate: 1.0,
      cold: 0.8
    };
    baseLoad *= climateFactors[loadInputs.climate];
    
    // Insulation adjustment
    const insulationFactors = {
      'R-13': 1.0,
      'R-19': 0.9,
      'R-30': 0.8,
      'R-38': 0.75
    };
    baseLoad *= insulationFactors[loadInputs.insulation];
    
    const tons = (baseLoad / 12000).toFixed(2);
    
    Alert.alert(
      'Load Calculation Results',
      `Total Cooling Load: ${Math.round(baseLoad).toLocaleString()} BTU/hr\n` +
      `Recommended System Size: ${tons} Tons\n\n` +
      `Suggested Equipment:\n` +
      `• ${Math.ceil(tons)} Ton AC Unit\n` +
      `• ${Math.round(baseLoad * 0.8)} BTU Furnace\n` +
      `• ${Math.round(sqft * 0.4)} CFM Airflow`
    );
  };

  // Duct Sizing Calculator
  const calculateDuctSize = () => {
    const cfm = parseFloat(ductInputs.cfm);
    const velocity = parseFloat(ductInputs.velocity);
    
    if (!cfm || !velocity) {
      Alert.alert('Error', 'Please enter CFM and velocity');
      return;
    }
    
    // Calculate duct area (sq ft)
    const area = cfm / velocity;
    
    let result = '';
    if (ductInputs.ductType === 'round') {
      // Round duct diameter
      const diameter = Math.sqrt((area * 144 * 4) / Math.PI);
      const standardSizes = [4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 22, 24];
      const recommendedSize = standardSizes.find(size => size >= diameter) || Math.ceil(diameter);
      
      result = `Round Duct:\n` +
               `Calculated Diameter: ${diameter.toFixed(2)}"\n` +
               `Recommended Size: ${recommendedSize}" diameter\n` +
               `Area: ${area.toFixed(2)} sq ft`;
    } else {
      // Rectangular duct
      const width = Math.sqrt(area * 144);
      const height = width;
      
      result = `Rectangular Duct:\n` +
               `Recommended Size: ${Math.round(width)}" x ${Math.round(height)}"\n` +
               `Area: ${area.toFixed(2)} sq ft`;
    }
    
    Alert.alert('Duct Sizing Results', result);
  };

  // Refrigerant Charge Calculator
  const calculateRefrigerantCharge = () => {
    const superheat = parseFloat(refrigerantInputs.superheat);
    const subcool = parseFloat(refrigerantInputs.subcool);
    const outdoorTemp = parseFloat(refrigerantInputs.outdoorTemp);
    
    if (!superheat || !subcool || !outdoorTemp) {
      Alert.alert('Error', 'Please enter all temperature values');
      return;
    }
    
    // Target ranges for R-410A
    const targetSuperheat = { min: 10, max: 15 };
    const targetSubcool = { min: 10, max: 15 };
    
    let diagnosis = '';
    let recommendation = '';
    
    // Superheat analysis
    if (superheat < targetSuperheat.min) {
      diagnosis += '⚠️ LOW SUPERHEAT - System may be overcharged\n';
      recommendation += '• Remove refrigerant\n';
    } else if (superheat > targetSuperheat.max) {
      diagnosis += '⚠️ HIGH SUPERHEAT - System may be undercharged\n';
      recommendation += '• Add refrigerant\n';
    } else {
      diagnosis += '✅ SUPERHEAT OK\n';
    }
    
    // Subcool analysis
    if (subcool < targetSubcool.min) {
      diagnosis += '⚠️ LOW SUBCOOL - System may be undercharged\n';
      recommendation += '• Add refrigerant\n';
    } else if (subcool > targetSubcool.max) {
      diagnosis += '⚠️ HIGH SUBCOOL - System may be overcharged\n';
      recommendation += '• Remove refrigerant\n';
    } else {
      diagnosis += '✅ SUBCOOL OK\n';
    }
    
    Alert.alert(
      'Refrigerant Charge Analysis',
      `${diagnosis}\n` +
      `Current Readings:\n` +
      `• Superheat: ${superheat}°F (Target: ${targetSuperheat.min}-${targetSuperheat.max}°F)\n` +
      `• Subcool: ${subcool}°F (Target: ${targetSubcool.min}-${targetSubcool.max}°F)\n` +
      `• Outdoor Temp: ${outdoorTemp}°F\n\n` +
      `Recommendations:\n${recommendation || '• System charge is optimal'}`
    );
  };

  // Electrical Load Calculator
  const calculateElectricalLoad = () => {
    const voltage = parseFloat(electricalInputs.voltage);
    const amperage = parseFloat(electricalInputs.amperage);
    const powerFactor = parseFloat(electricalInputs.powerFactor);
    
    if (!voltage || !amperage) {
      Alert.alert('Error', 'Please enter voltage and amperage');
      return;
    }
    
    // Calculate power
    const watts = voltage * amperage * powerFactor;
    const kw = watts / 1000;
    const hp = watts / 746;
    
    // Recommend wire size (simplified)
    let wireSize = '';
    if (amperage <= 15) wireSize = '14 AWG';
    else if (amperage <= 20) wireSize = '12 AWG';
    else if (amperage <= 30) wireSize = '10 AWG';
    else if (amperage <= 40) wireSize = '8 AWG';
    else if (amperage <= 55) wireSize = '6 AWG';
    else if (amperage <= 70) wireSize = '4 AWG';
    else if (amperage <= 95) wireSize = '2 AWG';
    else wireSize = '1 AWG or larger';
    
    // Recommend breaker size
    const breakerSize = Math.ceil(amperage * 1.25 / 5) * 5;
    
    Alert.alert(
      'Electrical Load Results',
      `Power Consumption:\n` +
      `• ${watts.toFixed(0)} Watts\n` +
      `• ${kw.toFixed(2)} kW\n` +
      `• ${hp.toFixed(2)} HP\n\n` +
      `Recommendations:\n` +
      `• Wire Size: ${wireSize}\n` +
      `• Breaker Size: ${breakerSize}A\n` +
      `• Voltage: ${voltage}V\n` +
      `• Current: ${amperage}A`
    );
  };

  const renderLoadCalculator = () => (
    <View style={styles.calculatorContainer}>
      <Text style={styles.calculatorTitle}>Load Calculation (Manual J)</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Square Footage"
        keyboardType="numeric"
        value={loadInputs.squareFootage}
        onChangeText={(text) => setLoadInputs({...loadInputs, squareFootage: text})}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Ceiling Height (ft)"
        keyboardType="numeric"
        value={loadInputs.ceilingHeight}
        onChangeText={(text) => setLoadInputs({...loadInputs, ceilingHeight: text})}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Number of Windows"
        keyboardType="numeric"
        value={loadInputs.windows}
        onChangeText={(text) => setLoadInputs({...loadInputs, windows: text})}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Number of Doors"
        keyboardType="numeric"
        value={loadInputs.doors}
        onChangeText={(text) => setLoadInputs({...loadInputs, doors: text})}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Number of Occupants"
        keyboardType="numeric"
        value={loadInputs.occupants}
        onChangeText={(text) => setLoadInputs({...loadInputs, occupants: text})}
      />
      
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Insulation Level:</Text>
        <View style={styles.buttonGroup}>
          {['R-13', 'R-19', 'R-30', 'R-38'].map(level => (
            <TouchableOpacity
              key={level}
              style={[
                styles.optionButton,
                loadInputs.insulation === level &amp;&amp; styles.optionButtonActive
              ]}
              onPress={() => setLoadInputs({...loadInputs, insulation: level})}
            >
              <Text style={[
                styles.optionButtonText,
                loadInputs.insulation === level &amp;&amp; styles.optionButtonTextActive
              ]}>
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Climate Zone:</Text>
        <View style={styles.buttonGroup}>
          {[
            { value: 'hot', label: 'Hot' },
            { value: 'moderate', label: 'Moderate' },
            { value: 'cold', label: 'Cold' }
          ].map(climate => (
            <TouchableOpacity
              key={climate.value}
              style={[
                styles.optionButton,
                loadInputs.climate === climate.value &amp;&amp; styles.optionButtonActive
              ]}
              onPress={() => setLoadInputs({...loadInputs, climate: climate.value})}
            >
              <Text style={[
                styles.optionButtonText,
                loadInputs.climate === climate.value &amp;&amp; styles.optionButtonTextActive
              ]}>
                {climate.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <TouchableOpacity style={styles.calculateButton} onPress={calculateLoad}>
        <Text style={styles.calculateButtonText}>Calculate Load</Text>
      </TouchableOpacity>
    </View>
  );

  const renderDuctCalculator = () => (
    <View style={styles.calculatorContainer}>
      <Text style={styles.calculatorTitle}>Duct Sizing Calculator</Text>
      
      <TextInput
        style={styles.input}
        placeholder="CFM (Cubic Feet per Minute)"
        keyboardType="numeric"
        value={ductInputs.cfm}
        onChangeText={(text) => setDuctInputs({...ductInputs, cfm: text})}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Velocity (FPM)"
        keyboardType="numeric"
        value={ductInputs.velocity}
        onChangeText={(text) => setDuctInputs({...ductInputs, velocity: text})}
      />
      
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Duct Type:</Text>
        <View style={styles.buttonGroup}>
          {[
            { value: 'round', label: 'Round' },
            { value: 'rectangular', label: 'Rectangular' }
          ].map(type => (
            <TouchableOpacity
              key={type.value}
              style={[
                styles.optionButton,
                ductInputs.ductType === type.value &amp;&amp; styles.optionButtonActive
              ]}
              onPress={() => setDuctInputs({...ductInputs, ductType: type.value})}
            >
              <Text style={[
                styles.optionButtonText,
                ductInputs.ductType === type.value &amp;&amp; styles.optionButtonTextActive
              ]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <TouchableOpacity style={styles.calculateButton} onPress={calculateDuctSize}>
        <Text style={styles.calculateButtonText}>Calculate Duct Size</Text>
      </TouchableOpacity>
      
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>💡 Quick Reference</Text>
        <Text style={styles.infoText}>• Typical velocity: 600-900 FPM</Text>
        <Text style={styles.infoText}>• Supply ducts: 700-900 FPM</Text>
        <Text style={styles.infoText}>• Return ducts: 500-700 FPM</Text>
      </View>
    </View>
  );

  const renderRefrigerantCalculator = () => (
    <View style={styles.calculatorContainer}>
      <Text style={styles.calculatorTitle}>Refrigerant Charge Calculator</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Superheat (°F)"
        keyboardType="numeric"
        value={refrigerantInputs.superheat}
        onChangeText={(text) => setRefrigerantInputs({...refrigerantInputs, superheat: text})}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Subcool (°F)"
        keyboardType="numeric"
        value={refrigerantInputs.subcool}
        onChangeText={(text) => setRefrigerantInputs({...refrigerantInputs, subcool: text})}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Outdoor Temperature (°F)"
        keyboardType="numeric"
        value={refrigerantInputs.outdoorTemp}
        onChangeText={(text) => setRefrigerantInputs({...refrigerantInputs, outdoorTemp: text})}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Indoor Temperature (°F)"
        keyboardType="numeric"
        value={refrigerantInputs.indoorTemp}
        onChangeText={(text) => setRefrigerantInputs({...refrigerantInputs, indoorTemp: text})}
      />
      
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Refrigerant Type:</Text>
        <View style={styles.buttonGroup}>
          {['R-410A', 'R-22', 'R-134a'].map(type => (
            <TouchableOpacity
              key={type}
              style={[
                styles.optionButton,
                refrigerantInputs.refrigerantType === type &amp;&amp; styles.optionButtonActive
              ]}
              onPress={() => setRefrigerantInputs({...refrigerantInputs, refrigerantType: type})}
            >
              <Text style={[
                styles.optionButtonText,
                refrigerantInputs.refrigerantType === type &amp;&amp; styles.optionButtonTextActive
              ]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <TouchableOpacity style={styles.calculateButton} onPress={calculateRefrigerantCharge}>
        <Text style={styles.calculateButtonText}>Analyze Charge</Text>
      </TouchableOpacity>
      
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>📊 Target Ranges (R-410A)</Text>
        <Text style={styles.infoText}>• Superheat: 10-15°F</Text>
        <Text style={styles.infoText}>• Subcool: 10-15°F</Text>
        <Text style={styles.infoText}>• Varies by outdoor temp</Text>
      </View>
    </View>
  );

  const renderElectricalCalculator = () => (
    <View style={styles.calculatorContainer}>
      <Text style={styles.calculatorTitle}>Electrical Load Calculator</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Voltage (V)"
        keyboardType="numeric"
        value={electricalInputs.voltage}
        onChangeText={(text) => setElectricalInputs({...electricalInputs, voltage: text})}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Amperage (A)"
        keyboardType="numeric"
        value={electricalInputs.amperage}
        onChangeText={(text) => setElectricalInputs({...electricalInputs, amperage: text})}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Power Factor (0.8-1.0)"
        keyboardType="numeric"
        value={electricalInputs.powerFactor}
        onChangeText={(text) => setElectricalInputs({...electricalInputs, powerFactor: text})}
      />
      
      <TouchableOpacity style={styles.calculateButton} onPress={calculateElectricalLoad}>
        <Text style={styles.calculateButtonText}>Calculate Load</Text>
      </TouchableOpacity>
      
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>⚡ Common Voltages</Text>
        <Text style={styles.infoText}>• Residential: 120V, 240V</Text>
        <Text style={styles.infoText}>• Commercial: 208V, 480V</Text>
        <Text style={styles.infoText}>• Power Factor: typically 0.9</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>HVAC Calculators</Text>
      </View>
      
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.tab, activeCalculator === 'load' &amp;&amp; styles.tabActive]}
            onPress={() => setActiveCalculator('load')}
          >
            <Text style={[styles.tabText, activeCalculator === 'load' &amp;&amp; styles.tabTextActive]}>
              Load Calc
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeCalculator === 'duct' &amp;&amp; styles.tabActive]}
            onPress={() => setActiveCalculator('duct')}
          >
            <Text style={[styles.tabText, activeCalculator === 'duct' &amp;&amp; styles.tabTextActive]}>
              Duct Sizing
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeCalculator === 'refrigerant' &amp;&amp; styles.tabActive]}
            onPress={() => setActiveCalculator('refrigerant')}
          >
            <Text style={[styles.tabText, activeCalculator === 'refrigerant' &amp;&amp; styles.tabTextActive]}>
              Refrigerant
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeCalculator === 'electrical' &amp;&amp; styles.tabActive]}
            onPress={() => setActiveCalculator('electrical')}
          >
            <Text style={[styles.tabText, activeCalculator === 'electrical' &amp;&amp; styles.tabTextActive]}>
              Electrical
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      <ScrollView style={styles.content}>
        {activeCalculator === 'load' &amp;&amp; renderLoadCalculator()}
        {activeCalculator === 'duct' &amp;&amp; renderDuctCalculator()}
        {activeCalculator === 'refrigerant' &amp;&amp; renderRefrigerantCalculator()}
        {activeCalculator === 'electrical' &amp;&amp; renderElectricalCalculator()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    backgroundColor: '#667eea',
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tabContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#667eea',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#667eea',
  },
  content: {
    flex: 1,
  },
  calculatorContainer: {
    padding: 20,
  },
  calculatorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  optionButtonActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  optionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  optionButtonTextActive: {
    color: '#FFFFFF',
  },
  calculateButton: {
    backgroundColor: '#667eea',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  calculateButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: '#EEF2FF',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 5,
  },
});

export default CalculatorScreen;