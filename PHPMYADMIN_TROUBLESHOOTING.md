# phpMyAdmin Connection Troubleshooting Guide for AMPPS

## Quick Diagnostic Steps

### 1. Check AMPPS Services Status
- Open **AMPPS Control Panel**
- Verify that **MySQL** service shows as **"Running"** (green)
- Verify that **Apache** service shows as **"Running"** (green)
- If either shows as stopped, click **Start** for each service

### 2. Check Port Conflicts
MySQL typically runs on port **3306**. Check if it's in use:

**On macOS (Terminal):**
```bash
lsof -i :3306
# or
netstat -an | grep 3306
```

If another process is using port 3306, you may need to:
- Stop the conflicting service
- Change MySQL port in AMPPS settings

### 3. Verify phpMyAdmin Access URL
**IMPORTANT:** Check your Apache port first! Your AMPPS Apache is configured on port **8000**, not 80.

Try accessing phpMyAdmin at:
- `http://localhost:8000/phpmyadmin` ⭐ **Try this first!**
- `http://127.0.0.1:8000/phpmyadmin`
- `http://localhost/phpmyadmin` (if Apache is on port 80)
- `http://127.0.0.1/phpmyadmin` (if Apache is on port 80)

**To check your Apache port:**
```bash
cat /Applications/AMPPS/apps/apache/etc/httpd.conf | grep "^Listen"
```

### 4. Check MySQL Connection Directly
Test if MySQL is actually running and accepting connections:

**On macOS (Terminal):**
```bash
# Try connecting via command line
# AMPPS MySQL password is usually stored in: /Applications/AMPPS/ampps/data/my.conf
mysql -u root -p
# Enter password when prompted (check my.conf file for password)
# Or try with password directly:
mysql -u root -p$(cat /Applications/AMPPS/ampps/data/my.conf)
```

**Common AMPPS MySQL passwords:**
- Default: `mysql` (stored in `/Applications/AMPPS/ampps/data/my.conf`)
- Sometimes: empty/blank (just press Enter)

If this fails, MySQL service is not running properly or password is incorrect.

### 5. Check AMPPS MySQL Configuration
Location: `/Applications/AMPPS/mysql/`

Check MySQL error logs:
```bash
tail -f /Applications/AMPPS/mysql/data/*.err
# or check
/Applications/AMPPS/mysql/data/*.err
```

### 6. Verify phpMyAdmin Configuration
Check phpMyAdmin config file:
- Location: `/Applications/AMPPS/www/phpmyadmin/config.inc.php`
- Verify MySQL host is set to: `127.0.0.1` or `localhost`
- Verify port is: `3306`
- Verify username: `root`
- Verify password: (usually empty for AMPPS default)

### 7. Check Apache Error Logs
If phpMyAdmin page loads but shows errors:
```bash
tail -f /Applications/AMPPS/apache/logs/error_log
```

### 8. Common Issues & Solutions

#### Issue: "Access Denied" or "Cannot connect to MySQL server"
**Solutions:**
- **Check MySQL password:** The password is stored in `/Applications/AMPPS/ampps/data/my.conf`
  ```bash
  cat /Applications/AMPPS/ampps/data/my.conf
  ```
- **Test connection with password:**
  ```bash
  mysql -u root -p$(cat /Applications/AMPPS/ampps/data/my.conf) -h 127.0.0.1
  ```
- **Check for multiple MySQL instances:** You might have both Homebrew MySQL and AMPPS MySQL running
  ```bash
  ps aux | grep mysqld
  ```
  If you see two MySQL instances, stop one of them to avoid conflicts
- Reset MySQL root password in AMPPS
- Check if MySQL socket file exists: `/Applications/AMPPS/apps/mysql/var/mysql.sock`
- Restart MySQL service in AMPPS

#### Issue: phpMyAdmin page doesn't load at all
**Solutions:**
- **Check Apache port:** Your AMPPS might be using port 8000 instead of 80
  ```bash
  cat /Applications/AMPPS/apps/apache/etc/httpd.conf | grep "^Listen"
  ```
- Try accessing: `http://localhost:8000/` (should show AMPPS welcome page)
- Try phpMyAdmin at: `http://localhost:8000/phpmyadmin/`
- Check if Apache is running: `ps aux | grep httpd`
- Check Apache port isn't blocked
- Check firewall settings

#### Issue: "Connection refused"
**Solutions:**
- MySQL service not started
- Wrong port number
- MySQL crashed - check error logs

#### Issue: Port already in use
**Solutions:**
- Find what's using the port: `lsof -i :3306`
- Kill the process or change MySQL port in AMPPS settings
- Restart MySQL service

### 9. Reset MySQL Root Password (if needed)
If you forgot the password:
1. Stop MySQL in AMPPS
2. Start MySQL in safe mode (via terminal)
3. Reset password
4. Restart MySQL normally

### 10. Reinstall/Repair AMPPS MySQL
If nothing works:
1. Backup your databases
2. Stop all AMPPS services
3. Use AMPPS repair/reinstall option
4. Restore databases

## Quick Test Commands

```bash
# Check if MySQL is running
ps aux | grep mysql

# Check if Apache is running
ps aux | grep httpd
# or
ps aux | grep apache

# Test MySQL connection
mysql -h 127.0.0.1 -P 3306 -u root -p

# Check port 3306
lsof -i :3306

# Check port 80 (Apache)
lsof -i :80
```

## Default AMPPS Credentials
- **MySQL Username:** `root`
- **MySQL Password:** Check `/Applications/AMPPS/ampps/data/my.conf` (usually `mysql`)
- **MySQL Port:** `3306`
- **Apache Port:** Check `httpd.conf` (often `8000` instead of `80`)

## Your Current Setup (Based on Diagnostics)
- **Apache Port:** `8000` (not 80!)
- **MySQL Password:** `mysql` (from my.conf file)
- **phpMyAdmin URL:** `http://localhost:8000/phpmyadmin/`
- **Issue Found:** Two MySQL instances running (Homebrew + AMPPS) - may cause conflicts

## Still Having Issues?
1. Check AMPPS official documentation
2. Review MySQL error logs in `/Applications/AMPPS/mysql/data/`
3. Review Apache error logs in `/Applications/AMPPS/apache/logs/`
4. Check system permissions on MySQL data directory
5. Verify macOS security settings aren't blocking MySQL

