#! /usr/local/bin/python3

import os
import json
from sys import argv
import sys
import re

folder1 = './src'
locales = './src/locales/en/common.json'
files = []
rawkeys = {}
keys = {}
excludedKeys = [
    'account.subaccounts',
    'account.tokens',
    'accounts.row',
    'errors',
    'common.timeAgo',
    'common.fromNow',
    'common.upToDate',
    'common.outdated',
    'migrateAccounts.progress',
    'migrateAccounts.overview',
    'selectableAccountsList',
    'portfolio.emptyState',
    'SelectDevice.steps.connecting.description',
    'ValidateOnDevice'
    #Unsure of these really, to be checked by owners
]

rep = '\\1((\$\{[\.-\[\]\\\w]+\})|\\\w+)' #default pattern to match
dynamicKeys = {
    '^(addAccounts.tokens.)\w+': rep,
    '^(addAccounts.sections.)\w+': rep,
    '^(byteSize.)\w+': rep,
    '^(cosmos.claimRewards.flow.steps.method.claimReward)\w+': rep,
    '^(cosmos.)\w+': rep,
    '^(delegation.broadcastSuccessTitle.)\w+': rep,
    '^(delegation.broadcastSuccessDescription.)\w+': rep,
    '^(FirmwareUpdate.steps.)[\w-]+': rep,
    '^(fees.speed.)\w+': rep,
    '^(migrateAccounts.progress.)\w+': rep,
    '^(onboarding.quizz.final.)\w+': rep,
    '^(onboarding.stepPairNew.)\w+': rep,
    '^(onboarding.stepNewDevice.)\w+': rep,
    '^(onboarding.stepSelectDevice.)\w+': rep,
    '^(onboarding.stepSetupDevice.setup.bullets.0.)\w+': rep,
    '^(onboarding.stepRecoveryPhrase.importRecoveryPhrase.bullets.0.)\w+': rep,
    '^(onboarding.stepUseCase.)\w+': rep,
    '^(operationDetails.extra.)[\w-]+': rep,
    '^(operations.types.)[\w-]+': rep,
    '^(settings.display.themes.)\w+': rep,
    '^(stellar.memoType.)\w+': rep,
    '^(transfer.lending.dashboard.activeAccount.)\w+': rep,
    '^(transfer.swap.form.)\w+': rep,
    '^(transfer.swap.)\w+': rep,
    '^(tron.freeze.flow.steps.)\w+': rep,
    '^(ValidateOnDevice.infoWording.)\w+': rep,
    '^(ValidateOnDevice.cosmos.)\w+': rep,
    '^(ValidateOnDevice.title.)\w+': rep,
    '^(ValidateOnDevice.recipientWording.)\w+': rep,
}

class bcolors:
    OK = '\033[92m'
    NOK = '\033[91m'
    ENDC = '\033[0m'

##Ugly way of listing all components
def recursive_walk(folder):
    for folderName, subfolders, filenames in os.walk(folder):
        if subfolders:
            for subfolder in subfolders:
                recursive_walk(subfolder)
        for filename in filenames:
            if filename.endswith(".js"):
                files.append(os.path.join(folderName, filename))

recursive_walk(folder1)

##Ugly way of getting all literals
def iterate(obj, stack):
    for attr, value in obj.items():
        key = stack+"."+attr
        
        if any(item.startswith(key) or key.startswith(item) for item in excludedKeys):
            continue
        if key.endswith("_plural"):
            continue
        if type(value) is dict:
            if len(stack):
                iterate(value, key)
            else:
                iterate(value, attr)
        else:
            rawkeys[key] = 1

with open(locales) as f:
    data = json.load(f)
iterate(data,'')
print("Found "+str(len(rawkeys))+" literals")

##After we have the raw keys, process them to extract dynamic fields from them
##Attempt to match against _maybe_ dynamic keys but still allow for static ones,
##This should work for both "im.a.${dynamic}.key" and "im.a.static.key" without fail.
compiledRes = {}
for rawkey, value in rawkeys.items(): #does it still need to be a dict?
    added = False
    for key, replacement in dynamicKeys.items():
        regexp = re.compile(key)
        if regexp.search(rawkey):
            newKey = re.sub(key, replacement, rawkey)
            keys[newKey] = 1
            added = True
            break
    if not added:
        keys[rawkey] = 1

counter = 0
for file in files:
    with open(file) as f:
        contents = f.read()
        counter += 1
        sys.stdout.write("\r"+str(counter)+"/"+str(len(files))+" files processed")
        for key, value in keys.items():
            if value == 0:
                continue
            regexp = ''
            if key in compiledRes:
                regexp = compiledRes[key]
            else:
                regexp = re.compile(key)
                compiledRes[key] = regexp
            if regexp.search(contents):
                keys[key] = 0

all = [ bcolors.NOK+key+bcolors.ENDC for (key, value) in keys.items() if value == 1]

if len(all) == 0:
    print("\nAll literals were found in the components")
else:
    print("\n".join(all))
    print("\nCouldn't find these literals ("+str(len(all))+")")
