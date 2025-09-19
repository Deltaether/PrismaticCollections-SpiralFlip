# File Transfer Guide - Phantasia Project

## Method 1: Using Croc (Recommended)

Croc is installed locally and provides the most reliable file transfer method.

### Step 1: Start File Transfer from Local Machine

Open a terminal in the project directory and run:

```bash
cd /home/delta/Projects/PrismaticCollections\(SpiralFlip_Site\)

# Send website files
croc send phantasia-website.tar.gz
```

This will output something like:
```
Sending 'phantasia-website.tar.gz' (670 MB)
Code is: 8888-alpha-bravo-charlie
On the other computer run

croc 8888-alpha-bravo-charlie
```

### Step 2: Receive Files on Server

1. Connect to the server:
   ```bash
   ssh root@212.227.85.148
   # Enter password: Kd7bY1mQ
   ```

2. Install croc on the server:
   ```bash
   curl -sSL https://getcroc.schollz.com | bash
   ```

3. Receive the website files using the code from step 1:
   ```bash
   croc 8888-alpha-bravo-charlie
   ```

### Step 3: Send Twitter Fetcher

Back on your local machine:
```bash
croc send twitter-python-fetcher.tar.gz
```

Use the new code provided on the server:
```bash
croc [new-code-from-sender]
```

### Step 4: Send Setup Script

Also transfer the setup script:
```bash
croc send server_setup_script.sh
```

Receive on server:
```bash
croc [code-from-sender]
```

## Method 2: Alternative Upload Methods

If croc doesn't work, here are alternative methods:

### Using a Temporary Web Server

1. On local machine, start a simple HTTP server:
   ```bash
   cd /home/delta/Projects/PrismaticCollections\(SpiralFlip_Site\)
   python3 -m http.server 8000
   ```

2. On server, download files:
   ```bash
   wget http://YOUR_LOCAL_IP:8000/phantasia-website.tar.gz
   wget http://YOUR_LOCAL_IP:8000/twitter-python-fetcher.tar.gz
   wget http://YOUR_LOCAL_IP:8000/server_setup_script.sh
   ```

### Using File Upload Services

1. Upload files to a service like:
   - WeTransfer (free up to 2GB)
   - SendAnywhere
   - Firefox Send alternative

2. Download on server using wget or curl

## Verification

After transfer, verify files on server:

```bash
ls -lh ~/*.tar.gz ~/server_setup_script.sh

# Should show:
# phantasia-website.tar.gz (approximately 670M)
# twitter-python-fetcher.tar.gz (approximately 33M)
# server_setup_script.sh (executable)
```

## Next Steps

Once files are transferred, make the setup script executable and run it:

```bash
chmod +x ~/server_setup_script.sh
bash ~/server_setup_script.sh
```

This will handle the complete server setup automatically.