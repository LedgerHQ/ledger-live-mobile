//
//  RCTBluetoothHelperModule.m
//  ledgerlivemobile
//
//  Created by jelbaz on 12/07/2021.
//  Copyright © 2021 Ledger SAS. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RCTBluetoothHelperModule.h"

@implementation RCTBluetoothHelperModule

// To export a module named BluetoothHelperModule
// Without passing in a name this will export the native module name as the Objective-C class name with “RCT” removed
RCT_EXPORT_MODULE();

/*
 * Prompts the user to enable bluetooth if possible.
 */
RCT_EXPORT_METHOD(prompt)
{
  CBCentralManager* manager = [CBCentralManager alloc];
  // Calling init() is enough to show a prompt with a redirect to the bluetooth settings.
  // (option "CBCentralManagerOptionShowPowerAlertKey" is true by default)
  // See: https://developer.apple.com/documentation/corebluetooth/cbcentralmanager/central_manager_initialization_options?language=objc
  [manager init];
}

@end
