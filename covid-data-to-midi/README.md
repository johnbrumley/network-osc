This is the current setup for pulling down covid time-series data and streaming via OSC

The streaming app is a processing sketch found in "cv19_osc_out_test"

requires the oscp5 and ControlP5 libraries by Andreas Schlegel

Currently the app pulls tiem series data from:
https://pomber.github.io/covid19/timeseries.json

It calculates the daily totals for confirmed, deaths, and recovered and sends the totals for each day over OSC as:

/confirmed
/deaths
/recovered

The values are normalized for each category, so they will always move from 0.0 to 1.0. The send rate is controlled from the GUI window.


A max patch is included to give an example of receiving the data as well as mapping the values to MIDI CC (0-127). Each channel can be togled to help with mapping the MIDI to a device. You can use the IAC driver on Mac as a virtual midi port or loopMIDI on Windows (not sure on linux?)
