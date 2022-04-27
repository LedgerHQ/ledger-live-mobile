//
//  SafariWebExtensionHandler.swift
//  Shared (Extension)
//
//  Created by Harrison Friia on 1/11/22.
//

import SafariServices
import React

class SafariWebExtensionHandler: NSObject, NSExtensionRequestHandling {

    private let startTime = Date()
    private let logger = Logger.extensionHandler

    private var rnBridge: RCTBridge?

    private var context: NSExtensionContext!
    private var currentMethodRequest: MethodRequest!

    override init() {
        super.init()
        logger.log(level: .debug, "Extension \(self.address) init.")

        logBreadcrumb("Extension \(self.address) init")

        NotificationCenter.default.addObserver(self, selector: #selector(passMessageToEventEmitter), name: .eventEmitterStartObserving, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(finish), name: .eventEmitterFinishedRequest, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(error), name: .eventEmitterError, object: nil)
    }

    deinit {
        logBreadcrumb("Extension \(self.address) deinit")
        let duration = startTime.distance(to: Date())
        logger.log(level: .debug, "Extension \(self.address) deinit. Alive for \(duration)s.")
    }

    func beginRequest(with context: NSExtensionContext) {
        guard let methodRequest = context.methodRequest else {
            failWithError(ExtensionHandlerError.unexpectedData)
            return
        }

        self.context = context
        self.currentMethodRequest = methodRequest

        logger.log(level: .debug, "Extension \(self.address) beginRequest: \(methodRequest.method).")

        startReactNative()
    }

    @objc func passMessageToEventEmitter() {
        guard let context = self.context else {
            preconditionFailure("context not set yet")
        }

        self.currentMethodRequest = context.methodRequest
        let method = currentMethodRequest.method

        logger.log(level: .debug, "Passing \(method) to EventEmitter.")
        logBreadcrumb("Starting \(method)")

        switch method {
        case "signPersonalMessage":
            guard let params = currentMethodRequest.payload as? [String: String],
                  let signData = params["data"] else {
                    preconditionFailure()
                  }

            EventEmitter.shared.personalSign([signData])

        case "eth_requestAccounts", "connectDapp":
            EventEmitter.shared.handleMessage(method)

        case "eth_sendTransaction":
            let jsonData = try! JSONEncoder().encode(currentMethodRequest.payload as! [String: String])
            let jsonString = String(data: jsonData, encoding: .utf8)!

            EventEmitter.shared.signTransaction(jsonString)

        case "solana_getAccount":
            EventEmitter.shared.handleMessage(method)

        case "solana_signAndSendTransaction", "solana_signTransaction", "solana_signAllTransactions":
            guard let data = currentMethodRequest.payload else {
                preconditionFailure()
            }
            EventEmitter.shared.signTransactionSolana(data)
        default:
            failWithError(ExtensionHandlerError.unsupportedMethod(method))
        }
    }

    @objc func finish() {
        let response = NSExtensionItem()
        let method = currentMethodRequest.method

        logBreadcrumb("Finishing \(method)")

        switch method {
        case "eth_requestAccounts":
            let address = EventEmitter.shared.deviceAndAccount!.address
            response.userInfo = [SFExtensionMessageKey: methodResponse(with: address)]

        case "signPersonalMessage":
            let signature = EventEmitter.shared.signatureResult!
            response.userInfo = [SFExtensionMessageKey: methodResponse(with: signature)]

        case "eth_sendTransaction":
            let signedTx = EventEmitter.shared.signedTx!
            response.userInfo = [SFExtensionMessageKey: methodResponse(with: signedTx)]

        case "solana_getAccount":
            let address = EventEmitter.shared.deviceAndAccount!.address
            response.userInfo = [SFExtensionMessageKey: methodResponse(with: address)]

        case "solana_signAndSendTransaction", "solana_signTransaction", "solana_signAllTransactions":
            let signature = EventEmitter.shared.signedTx!
            response.userInfo = [SFExtensionMessageKey: methodResponse(with: signature)]

        default:
            failWithError(ExtensionHandlerError.unsupportedMethod(method))
        }

        SentrySDK.capture(message: "\(method) finished")

        self.logger.debug("\(method) completed.")
        context.completeRequest(returningItems: [response])
    }

    @objc func error() {
        failWithError(EventEmitter.shared.error ?? ExtensionHandlerError.unknown)
    }
}

extension SafariWebExtensionHandler: RCTBridgeDelegate {
    func sourceURL(for bridge: RCTBridge!) -> URL! {
        return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index-extension", fallbackResource: nil)
    }
}

private extension SafariWebExtensionHandler {

    func startReactNative() {
        let start = Date()
        logger.debug("Starting React Native.")
        self.rnBridge = RCTBridge(delegate: self, launchOptions: [:])
        logger.debug("React Native started in \(-start.timeIntervalSinceNow)s.")
    }

    func failWithError(_ error: Error) {
        let errorResponse = errorResponse(error: error)
        let method = currentMethodRequest.method

        let response = NSExtensionItem()
        response.userInfo = [SFExtensionMessageKey: errorResponse]

        logBreadcrumb("Method \(method) failed with error.")

        if let bridgeError = error as? DeviceBridgeError {
            let event = Event(level: .error)
            event.message = SentryMessage(formatted: bridgeError.message)
            event.fingerprint = [bridgeError.message]
            SentrySDK.capture(event: event) { scope in
                scope.setContext(value: bridgeError.asDictionary, key: "errorDetails")
            }
        } else {
            SentrySDK.capture(error: error)
        }

        self.logger.debug("Error handling \(method)")
        context.completeRequest(returningItems: [response])
    }

    func methodResponse(with value: Any) -> [String: Any] {
        // TODO: Make method request codable and return a serialized instance
        return [
            ExtensionMessageKey.id: currentMethodRequest.id,
            ExtensionMessageKey.value: value
        ]
    }

    func errorResponse(error: Error) -> [String: Any] {
        return [
            ExtensionMessageKey.error: error.localizedDescription
        ]
    }

}

func logBreadcrumb(_ message: String) {
    let crumb = Breadcrumb()
    crumb.level = SentryLevel.info
    crumb.message = message
    SentrySDK.addBreadcrumb(crumb: crumb)
}

fileprivate let isSimulator: Bool = {
#if targetEnvironment(simulator)
    return true
#else
    return false
#endif
}()
