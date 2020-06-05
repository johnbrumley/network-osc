class Country {
  String name;
  Day[] days;
  
  class Day {
    String date;
    IntDict info;
    
    Day(String _date, int _confirmed, int _deaths, int _recovered){
      date = _date;
      
      info = new IntDict();
      info.set("confirmed", _confirmed);
      info.set("deaths", _deaths);
      info.set("recovered", _recovered);
    }
    
    int getInfo(String type){
      return info.get(type);
    }
  }
  
  Country(String _name, JSONArray _data){
    name = _name;
    
    // process json array
    days = new Day[_data.size()];
    for (int i = 0; i < _data.size(); i++) {
      JSONObject day = _data.getJSONObject(i);
      
      days[i] = new Day(
        day.getString("date"), 
        day.getInt("confirmed"), 
        day.getInt("deaths"), 
        day.getInt("recovered"));
    }
  }
}
