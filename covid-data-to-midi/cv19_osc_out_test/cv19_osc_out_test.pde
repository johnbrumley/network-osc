import java.util.Set;
import netP5.*;
import oscP5.*;
import controlP5.*;

// OSC
OscP5 oscP5;
NetAddress addr;
String ip = "127.0.0.1";
int port = 12000;
int sendRate;
int lastSend;

// GUI
PFont f;
ControlP5 cp5;
Textlabel slowLabel;
Textlabel fastLabel;
boolean showBlip = false;
int blipTime = 100;

// DATA
String url = "https://pomber.github.io/covid19/timeseries.json";
JSONObject cv19;
Country[] dataset;
int[][] totals;

int currentDay = 0;
int totalDays;


void setup(){
  size(400,400);
  
  // get data from the net
  getData();
  // grab length of data
  totalDays = dataset[0].days.length;
  println(totalDays + " days of data found");
  // calculate totals
  calcTotals();
  
  // init osc
  oscP5 = new OscP5(this,port);
  addr = new NetAddress(ip,port);
  
  // sending speed
  sendRate = 1000;
  lastSend = 0;
  
  buildGUI();
}

void draw(){
  background(0);
  
  if(millis() > lastSend + sendRate){
    //sendData();
    sendDailyTotals();
    
    // increment day
    currentDay++;
    if(currentDay >= totalDays) currentDay = 0;
    
    lastSend = millis();
    showBlip = true;
  }
  
  drawGUI();
}



// get data and store
void getData(){
  cv19 = loadJSONObject(url);
  Set<String> countries = cv19.keys();
  
  dataset = new Country[countries.size()];
  
  int i = 0;
  for (String cName : countries ) {
    // grab the counrty array
    JSONArray cData = cv19.getJSONArray(cName);
    
    dataset[i] = new Country(cName, cData);
    i++;
  }
}

void calcTotals(){
  // calculate total amounts
  totals = new int[totalDays][3];
  
  // go through each day
  for(int i = 0; i < totalDays; i++){
    int dailyConfirmed = 0;
    int dailyDeaths = 0;
    int dailyRecovered = 0;
    for(Country c : dataset){
      dailyConfirmed += c.days[i].getInfo("confirmed");
      dailyDeaths += c.days[i].getInfo("deaths");
      dailyRecovered += c.days[i].getInfo("recovered");
    }
    
    totals[i][0] = dailyConfirmed;
    totals[i][1] = dailyDeaths;
    totals[i][2] = dailyRecovered;
    
  }
}

// send individual country data for current day via OSC
void sendData(){
  String[] types = {"confirmed", "deaths", "recovered"};
  
  for(Country c : dataset){
    //println(c.name + " : " + c.data[0].deaths);
    for(String type : types){
      String tag = "/" + c.name + "/" + type;
      OscMessage msg = new OscMessage(tag);
    
      msg.add(c.days[currentDay].getInfo(type));
      
      oscP5.send(msg, addr); 
    }
  }
}

// send country totals for current day
void sendDailyTotals(){
  String[] types = {"confirmed", "deaths", "recovered"};
  int[] maxValues = { totals[totalDays - 1][0], totals[totalDays - 1][1], totals[totalDays - 1][2]};
  
  for(int i = 0; i < types.length; i++){
    String tag = "/" + types[i];
    OscMessage msg = new OscMessage(tag);
    
    // normalize the data
    float value = map(totals[currentDay][i], 0, maxValues[i], 0.0, 1.0);
    msg.add(value);
    
    oscP5.send(msg, addr); 
  }
}




void buildGUI(){
  // setup GUI
  f = createFont("SourceCodePro-Regular.ttf", 25);
  textFont(f);
  
  cp5 = new ControlP5(this);
  // add a vertical slider
  cp5.addSlider("sendRate")
     .setPosition(50,50)
     .setSize(50,300)
     .setRange(200,5000)
     .setValue(1000);
  slowLabel = cp5.addTextlabel("slow")
                    .setText("SLOW")
                    .setPosition(120,50)
                    .setColorValue(0xffffffff)
                    .setFont(f)
                    ;
  fastLabel = cp5.addTextlabel("fast")
                    .setText("FAST")
                    .setPosition(120,330)
                    .setColorValue(0xffffffff)
                    .setFont(f)
                    ;
}

void drawGUI(){
  // show address on the top
  fill(255);
  textAlign(LEFT);
  textSize(15);
  String txt = "ip: " + ip + " port:" + str(port);
  text(txt, 5, 15);
  
  if(showBlip) {
    fill(255);
    ellipse(width - 150, height/2, 200, 200);
    if(millis() > lastSend + blipTime){
      showBlip = false;
    }
    fill(0);
    textAlign(CENTER);
    textSize(100);
    text(str(currentDay), width - 150, height/2 + 25);
  }
  
  fill(color(255,0,0));
  rect(0, height - 10, map(currentDay, 0, totalDays, 0, width), 50);
}


// respond to slider movement
void slider(int sliderSpeed) {
  sendRate = sliderSpeed;
}
