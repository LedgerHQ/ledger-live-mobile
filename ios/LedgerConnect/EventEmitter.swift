//
//  EventEmitter.swift
//  LedgerConnect Extension (iOS)
//
//  Created by Harrison Friia on 1/28/22.
//

import Foundation
import React
import NotificationCenter

enum RNEventName {
    static let getAccount = "getAccount"
    static let personalSign = "personalSign"
    static let signTransaction = "signTransaction"
    static let solanaGetAccount = "solana_getAccount"
    static let solanaSignAndSendTransaction = "solana_signAndSendTransaction"
}

@objc(EventEmitter)
class EventEmitter: RCTEventEmitter {

    private let logger = Logger.eventEmitter

    public static var shared: EventEmitter!

    var deviceAndAccount: DeviceAndAccount?
    var signatureResult: String?
    var signedTx: String?
    var error: Error?

    private override init() {
        super.init()
        EventEmitter.shared = self
        logger.log(level: .debug, "EventEmitter \(self.address) init")
    }

    deinit {
        logger.log(level: .debug, "EventEmitter \(self.address) deinit")
    }

    @objc
    override static func requiresMainQueueSetup() -> Bool {
        return false
    }

    @objc
    override func constantsToExport() -> [AnyHashable : Any]! {
        return [:]
    }

    override func supportedEvents() -> [String]! {
        return [
            RNEventName.getAccount,
            RNEventName.personalSign,
            RNEventName.signTransaction,
            RNEventName.solanaGetAccount,
            RNEventName.solanaSignAndSendTransaction
        ]
    }

    override func startObserving() {
        logger.log(level: .debug, "startObserving")
        NotificationCenter.default.post(Notification(name: .eventEmitterStartObserving))
    }
    
    override func stopObserving() {
        logger.log(level: .debug, "stopObserving")
        NotificationCenter.default.post(Notification(name: .eventEmitterStopObserving))
    }

    func handleMessage(_ message: String) {
        logger.log("handleMessage: \(message)")

        switch message {
        case "eth_requestAccounts":
            sendEvent(withName: RNEventName.getAccount, body: [])

        case "solana_getAccount":
            sendEvent(withName: RNEventName.solanaGetAccount, body: [])

        default:
            logger.log("handleMessage - unsupported message: \(message)")
        }
    }

    func personalSign(_ data: [String]) {
        sendEvent(withName: RNEventName.personalSign, body: data)
    }

    func signTransaction(_ data: String) {
        sendEvent(withName: RNEventName.signTransaction, body: data)
    }

    func signTransactionSolana(_ data: Any) {
        sendEvent(withName: RNEventName.solanaSignAndSendTransaction, body: data)
    }

    @objc
    func foundDevices(_ devices: NSString) {
        logger.log(level: .debug, "Found device")

        logBreadcrumb("Found devices")

        let data = (devices as String).data(using: .utf8)

        do {
            deviceAndAccount = try JSONDecoder().decode(DeviceAndAccount.self, from: data!)
        } catch let decodeError {
            self.error = decodeError
            SentrySDK.capture(error: decodeError)
            NotificationCenter.default.post(name: .eventEmitterError, object: self)
        }

        NotificationCenter.default.post(name: .eventEmitterFinishedRequest, object: self)
    }

    @objc
    func signatureComplete(_ signature: NSString) {
        logger.log(level: .debug, "Signature complete")

        signatureResult = signature as String

        NotificationCenter.default.post(name: .eventEmitterFinishedRequest, object: self)
    }

    @objc
    func requestComplete(_ result: NSString) {
        logger.log(level: .debug, "Request complete")

        signedTx = result as String

        NotificationCenter.default.post(name: .eventEmitterFinishedRequest, object: self)
    }

    @objc
    func transportError(_ error: NSString) {
        logger.log(level: .debug, "Device bridge error: \(error)")

        if let data = (error as String).data(using: .utf8) {
            do {
                let error = try JSONDecoder().decode(DeviceBridgeError.self, from: data)
                self.error = error
            } catch let decodeError {
                self.error = DeviceBridgeError(message: decodeError.localizedDescription)
            }

        } else {
            self.error = DeviceBridgeError(message: "unknown error")
        }

        NotificationCenter.default.post(name: .eventEmitterError, object: self)
    }
}
