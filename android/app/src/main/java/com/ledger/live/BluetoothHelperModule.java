package com.ledger.live;

import android.bluetooth.BluetoothAdapter;
import android.content.Intent;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Map;
import java.util.HashMap;

public class BluetoothHelperModule extends ReactContextBaseJavaModule {
  public BluetoothHelperModule(ReactApplicationContext context) {
    super(context);
  }

  @Override
  public String getName() {
    return "BluetoothHelperModule";
  }

  /*
   * Prompts the user to enable bluetooth if possible.
   */
  @ReactMethod
  public void prompt() {
    BluetoothAdapter bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
    if (bluetoothAdapter != null && !bluetoothAdapter.isEnabled()) {
      // Activity Action: Show a system activity that allows the user to turn on Bluetooth.
      // This system activity will return once Bluetooth has completed turning on, or the user has decided not to turn Bluetooth on.
      // See: https://developer.android.com/reference/android/bluetooth/BluetoothAdapter#ACTION_REQUEST_ENABLE
      Intent enableBtIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
      this.getCurrentActivity().startActivityForResult(enableBtIntent, 0);
    }
  }
}