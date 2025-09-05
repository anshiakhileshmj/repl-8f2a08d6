-- Complete SQL script to set up profile data correctly for your AML Dashboard
-- Run this in your Supabase SQL Editor

-- First, ensure all necessary columns exist in the profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS job_title TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS business_type TEXT,
ADD COLUMN IF NOT EXISTS location TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS department TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS company_website TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS linkedin_profile TEXT DEFAULT '';

-- Make email field non-editable by creating a restrictive policy
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create new update policy that prevents email changes
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (
    auth.uid() = user_id 
    -- Email must remain the same as current value
    AND email = (SELECT email FROM public.profiles WHERE user_id = auth.uid())
);

-- Update the trigger function to handle all signup form data properly
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create comprehensive function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    new_partner_id TEXT;
BEGIN
    -- Generate a unique partner ID
    new_partner_id := public.generate_partner_id();
    
    -- Insert new profile with all metadata from signup
    INSERT INTO public.profiles (
        user_id, 
        partner_id, 
        full_name, 
        email,
        first_name,
        last_name,
        company_name,
        job_title,
        phone,
        country,
        business_type,
        location,
        bio,
        department,
        company_website,
        linkedin_profile
    )
    VALUES (
        NEW.id,
        new_partner_id,
        -- Create full name from first and last name
        TRIM(COALESCE(NEW.raw_user_meta_data->>'first_name', '') || ' ' || COALESCE(NEW.raw_user_meta_data->>'last_name', '')),
        COALESCE(NEW.email, ''),
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'company_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'job_title', ''),
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        COALESCE(NEW.raw_user_meta_data->>'country', ''),
        COALESCE(NEW.raw_user_meta_data->>'business_type', ''),
        '', -- location - empty by default, editable
        '', -- bio - empty by default, editable
        '', -- department - empty by default, editable
        '', -- company_website - empty by default, editable
        ''  -- linkedin_profile - empty by default, editable
    );
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error but don't fail user creation
        RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT EXECUTE ON FUNCTION public.generate_partner_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;