# Homey TV Guide

What if your Homey that stands all day in your home controlling devices now can help you remember to watch to really important
TV program that is on Dutch television? Now you can.

This app will give Homey the functionality to keep an eye on those program's you want to watch but always forget. Make flows 
that will trigger an alarm when your favorite program starts. Or make a flow that will automaticaly start your TV and put it on the correct channel. 

# Settings

## TV Guide

In the settings you can get a list of programs on various TV Channels. You can bookmark 
programs so you can use them inside the flows ( see trigger ). 

## Channel mapping

Because the channel numbers internal are different from the channel configuration on your television you can manage it here. Lets say you want to switch to Discovery Channel, which uses 29 internally, in a certain flow and your TV has this on channel 7 you can adjust this in the mapping. This way you can use the token channel in the 
action column to switch to the correct channel!


# Cards

##Triggers

- Add a trigger that specifies which of your favorites Homey should keep an eye on. Specify the offset ( in minutes ) and the progranm you have added to your favorite.
  The trigger has tokens for the Title and the channel. This channel is changed to the mapped channel when a mapping has been set.

##Conditions

##Actions

## Changelog

0.0.1
* Initial release